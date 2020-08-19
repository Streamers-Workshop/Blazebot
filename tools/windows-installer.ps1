if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
 if ([int](Get-CimInstance -Class Win32_OperatingSystem | Select-Object -ExpandProperty BuildNumber) -ge 6000) {
  $CommandLine = "-File `"" + $MyInvocation.MyCommand.Path + "`" " + $MyInvocation.UnboundArguments
  Start-Process -FilePath PowerShell.exe -Verb Runas -ArgumentList $CommandLine
  Exit
 }
}


Write-Host "Setting up Temp Directory...."

[void](New-Item -ItemType directory -Path "$($Env:temp)\trovobot_setup")

Write-Host "Downloading Node.js......"

if ((Get-WmiObject win32_operatingsystem | select osarchitecture).osarchitecture -like "64*")
  Invoke-WebRequest -Uri "https://nodejs.org/dist/v12.18.2/node-v12.18.2-x64.msi" -OutFile "$($Env:temp)\trovobot_setup\nodejs.msi"
} else {
  Invoke-WebRequest -Uri "https://nodejs.org/dist/v12.18.2/node-v12.18.2-x86.msi" -OutFile "$($Env:temp)\trovobot_setup\nodejs.msi"
}

Write-Host "Download Complete! Now Installing Node.js.........."

msiexec /a "$($Env:temp)\nodejs.msi" ADDLOCAL=ALL /qn /log "$PSScriptRoot\nodejs.install.log"

Write-Host "Downloading Chocolatey Install file."

Invoke-WebRequest -Uri "https://chocolatey.org/install.ps1" -OutFile "$($Env:temp)\trovobot_setup\chocolatey.ps1"

Write-Host "Launching the chocolatey.ps1 File....."

& "$($Env:temp)\trovobot_setup\chocolatey.ps1"

Write-House "Refreshing Env..."

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Installing Deps via Chocolatey...."

iex "choco upgrade -y python visualstudio2019-workload-vctools yarn"

Write-Host "Refreshing env...."

iex "refreshenv"

Write-Host "Downloading TrovoBot..."

Invoke-WebRequest -Uri "https://github.com/Bioblaze/TrovoBot/archive/master.zip" -OutFile "$($Env:temp)\trovobot_setup\master.zip"

Write-Host "Setting up TrovoBot..."

Expand-Archive -Path "$($Env:temp)\trovobot_setup\master.zip" -DestinationPath "$($PSCommandPath[0]):\" -Verbose

Rename-Item -path "$($PSCommandPath[0]):\TrovoBot-master" -newName "$($PSCommandPath[0]):\TrovoBot"

Start-Process -Wait -NoNewWindow 'yarn' -ArgumentList 'install' -WorkingDirectory "$($PSCommandPath[0]):\TrovoBot"

Write-Host "Opening Explorer Window to TrovoBot, please finish following the directions to setup your bot properly."

Invoke-Item "$($PSCommandPath[0]):\TrovoBot"

Write-Host "Cleaning up TrovoBot Deps Setup...."

Remove-Item "$($Env:temp)\trovobot_setup" -Recurse

Read-Host -Prompt "Press Enter to exit"
