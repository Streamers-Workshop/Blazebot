#!/bin/bash

DIR=$(pwd)

echo "Do you want to continue?"
read usr
echo ""

if [[ $usr = y || $usr = Y ]]; then


tput cup 3 19
tput setaf 3
echo "Enter System Password Below to Continue"
tput sgr0

sudo -v; sudo apt-get update
#Determine if the operating system is 32 or 64-bit and then install ia32-libs if necessary.
d=ia32-libs

if [[ `getconf LONG_BIT` = "64" ]];

then
    echo "64-bit operating system detected.  Checking to see if $d is installed."

    if [[ $(dpkg-query -f'${Status}' --show $d 2>/dev/null) = *\ installed ]]; then
    	echo "$d already installed."
    else
        echo "Installing now..."
    	sudo -v; sudo apt-get --force-yes -y install $d
    fi
else
	echo "32-bit operating system detected.  Skipping."
fi

c=nodejs
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
  curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=gconf-service
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libasound2
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libatk1.0-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libcairo2
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libcups2
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libdbus-1-3
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libexpat1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libfontconfig1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libgcc1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libgconf-2-4
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libgdk-pixbuf2.0-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libglib2.0-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libgtk-3-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libnspr4
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi


c=libpango-1.0-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libpangocairo-1.0-0
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libstdc++6
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libx11-6
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libx11-xcb1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxcb1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxcomposite1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxcursor1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxdamage1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxext6
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxfixes3
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxi6
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxrandr2
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxrender1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxss1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libxtst6
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=ca-certificates
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=fonts-liberation
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libappindicator1
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libnss3
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=lsb-release
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=xdg-utils
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=wget
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi

c=libgbm-dev
	echo "checking if $c is installed" 2>&1
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "$c already installed.  Skipping."
else
	echo "$c was not found, installing..." 2>&1
	sudo -v; sudo apt-get --force-yes -y install $c 2>/dev/null
fi
fi
