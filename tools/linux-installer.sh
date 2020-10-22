#!/usr/bin/env bash

###############################################################
### TrovoBot Install Script
###
### Copyright (C) 2020 Andre Saddler
###
### By: Andre Saddler (Rehkloos)
### Email: contact@rehkloos.com
### Webpage: https://rehkloos.com
###
### Licensed under the Apache License, Version 2.0 (the "License");
### you may not use this file except in compliance with the License.
### You may obtain a copy of the License at
###
###    http://www.apache.org/licenses/LICENSE-2.0
###
### Unless required by applicable law or agreed to in writing, software
### distributed under the License is distributed on an "AS IS" BASIS,
### WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
### See the License for the specific language governing permissions and
### limitations under the License.
################################################################

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
version="2.0.2"
nodeLTS="12.18.3"
link="https://github.com/Streamers-Workshop/TrovoBot/archive/${version}.zip"

# Script can be executed only in linux
#linux=$(echo "$OSTYPE" | grep "linux")
#[ -z $linux ] && echo "Script Cannot be executed on another operation system. Only Linux." && exit 1

color(){
  RED=`tput setaf 1`
  GRN=`tput setaf 2`
  YLLW=`tput setaf 3`
  NC=`tput sgr0` # No Color
}

unameOut="$(uname -s)"

# Help menu
help(){
  echo "-h | --help                   : this screen"
  echo "-i | --install                : install"
  echo "-d | --download               : download latest TrovoBot build"
  echo "-m | --mac                    : macOS install"
  echo "no args                       : start installer w/ menu"
}

# Check OS
function checkos(){
if [[ "$(uname)" == "$1" ]]; then
    echo true
  else
    echo false
  fi
}

IS_MAC=$(checkos "Darwin")
IS_LINUX=$(checkos "Linux")

macinstall(){
  color
  curlDL="curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash"

  if [[ "$IS_MAC" = true ]]; then
  touch ~/.bash_profile # create bash_profile
    touch ~/.bashrc # create bashrc
  touch ~/.zshrc # create zshrc
  touch ~/.profile # create profile
  $curlDL
    sleep 2

  echo "${RED} Installing nodejs via nvm ${NC}"
  nvm install $nodeLTS # install current node LTS
  nvm use $nodeLTS
  sleep 1

  echo "${RED} getting latest NPM ${NC}"
  npm install -g npm@latest
  sleep 2

    echo "${RED} now installing YARN ${NC}"
  npm install -g yarn


  source ~/.bash_profile
  elif [[ "$IS_MAC" = false ]]; then
    echo "${RED} This option is for MacOS not Linux based distros, re-run script and choose correct menu option ${NC}"
  fi
}

trovodl(){
  color
  echo "${GRN} Downloading TrovoBot ${NC}"
  wget -q -O tmp.zip ${link} && unzip tmp.zip && rm tmp.zip
  echo "${GRN} Renaming Trovobot directory ${NC}"
  find $DIR -depth -type d -name 'TrovoBot*' -exec mv {} TrovoBot \;
  echo "${GRN} Finished Download ${NC}"
}

depds(){
  color
  # Install nodejs
  c=nodejs
  if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
  then
  echo "${GRN} $c already installed.  Skipping. ${NC}"
  else
  echo "${RED} $c was not found, installing dependencies ${NC}" 2>&1
    curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  fi

  # Install yarn
  c=yarn
  if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
  then
  echo "${GRN} $c already installed.  Skipping. ${NC}"
  else
  echo "${RED} $c was not found, installing dependencies ${NC}" 2>&1
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  fi
}

#update
update(){
  color
  if [[ -d "$DIR/TrovoBot" ]];
then
  cd $DIR/TrovoBot
  echo "${YLLW} updating dependencies ${NC}"
  yarn update > /dev/null 2>&1 &
  while kill -0 $! 2> /dev/null; do
      echo -n '.'
      sleep 1
  done
elif [[ ! -d "$DIR/TrovoBot"  ]]; then
  echo "${RED} 'TrovoBot' directory does not exist ${NC}"
  exit 0
fi
}

# Full environment install
install(){

trovodl # Download TrovoBot from ZIP

tput reset

depds # setup nodejs and yarn sources

color

tput cup 3 19
tput setaf 3
echo "Enter System Password Below to Continue"
tput sgr0

sudo -v; sudo apt-get update

 REQPKGS=("nodejs" "yarn" "gconf-service" "libasound2" "libatk1.0-0" "libcairo2" "libcups2" "libdbus-1-3" "libexpat1" "libfontconfig1" "libgcc1"
 "libgconf-2-4" "libgdk-pixbuf2.0-0" "libglib2.0-0" "libgtk-3-0" "libnspr4" "libpango-1.0-0" "libpangocairo-1.0-0" "libstdc++6" "libx11-6"
 "libx11-xcb1" "libxcb1" "libxcomposite1" "libxcursor1" "libxdamage1" "libxext6" "libxfixes3" "libxi6" "libxrandr2" "libxrender1" "libxss1"
 "libxtst6" "ca-certificates" "fonts-liberation" "libappindicator1" "libnss3" "lsb-release" "xdg-utils" "wget" "libgbm-dev")

for pkg in "${REQPKGS[@]}"; do
    if [[ $(dpkg-query -f'${Status}' --show $pkg 2>/dev/null) = *\ installed ]];
then
   echo "${GRN} $pkg already installed.  Skipping. ${NC}"
else
   echo "${RED} $pkg was not found, installing... ${NC}" 2>&1
 elif [[ ! -z "$(uname)" == "Mac" ]]; then
   sudo -v; sudo apt-get --allow -y install $c 2>/dev/null
fi
done

if [[ -d "$DIR/TrovoBot" ]];
then
cd $DIR/TrovoBot
echo "${YLLW} Installing dependencies ${NC}"
yarn install > /dev/null 2>&1 &
while kill -0 $! 2> /dev/null; do
    echo -n '.'
    sleep 1
done
elif [[ ! -d "$DIR/TrovoBot"  ]]; then
  echo "${RED} 'TrovoBot' directory does not exist ${NC}"
  exit 0
fi
}


function manageMenu() {
  tput reset
  color
  echo '
               ________                                       _______               __
              /        |                                     /       \             /  |
              $$$$$$$$/______    ______   __     __  ______  $$$$$$$  |  ______   _$$ |_
		 $$ | /      \  /      \ /  \   /  |/      \ $$ |__$$ | /      \ / $$   |
		 $$ |/$$$$$$  |/$$$$$$  |$$  \ /$$//$$$$$$  |$$    $$< /$$$$$$  |$$$$$$/
		 $$ |$$ |  $$/ $$ |  $$ | $$  /$$/ $$ |  $$ |$$$$$$$  |$$ |  $$ |  $$ | __
		 $$ |$$ |      $$ \__$$ |  $$ $$/  $$ \__$$ |$$ |__$$ |$$ \__$$ |  $$ |/  |
		 $$ |$$ |      $$    $$/    $$$/   $$    $$/ $$    $$/ $$    $$/   $$  $$/
		 $$/ $$/        $$$$$$/      $/     $$$$$$/  $$$$$$$/   $$$$$$/     $$$$/


																																								 '
  echo ""
  echo ""
  echo "${YLLW}   What do you want to do?${NC}"
  echo "${YLLW}   1) Fully Install TrovoBot ${NC}"
  echo "${YLLW}   2) Update TrovoBot dependencies ${NC}"
  echo "${YLLW}   3) Download TrovoBot ZIP (only) ${NC}"
  echo "${YLLW}   4) MacOS install (non linux-base) ${NC}"
  echo "${YLLW}   5) Exit ${NC}"
  until [[ ${MENU_OPTION} =~ ^[1-4]$ ]]; do
  read -rp "Select an option [1-4]: " MENU_OPTION
  done
  case "${MENU_OPTION}" in
  1)
  install
  ;;
  2)
  update
  ;;
  3)
  trovodl
  ;;
  4)
  macinstall
  ;;
  5)
  exit 0
  ;;
  esac
}

checkos
if [[ "$IS_MAC" = true || "$IS_LINUX" = true ]]; then
# non-gui arguments
while (( "$#" )); do
  case $1 in
    -h|--help) help
               exit 0;;
    -i|--install) install
                  exit 0;;
    -u|--update) update
                  exit 0;;
    -d|--download) trovodl
                  exit 0;;
    -m|--mac) macinstall
                  exit 0;;
  esac
  shift
done

manageMenu

elif [[ "$IS_MAC" = false && "$IS_LINUX" = false ]]; then
  echo "Unsupported OS"
  exit 1
fi
