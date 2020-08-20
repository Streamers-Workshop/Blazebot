#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


echo "Do you want to continue?"
read usr
echo ""

if [[ $usr = y || $usr = Y ]]; then

RED=`tput setaf 1`
GRN=`tput setaf 2`
YLLW=`tput setaf 3`
NC=`tput sgr0` # No Color

c=nodejs
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "${GRN} $c already installed.  Skipping. ${NC}"
else
	echo "${RED} $c was not found, installing dependencies ${NC}" 2>&1
  curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
fi

c=yarn
if [[ $(dpkg-query -f'${Status}' --show $c 2>/dev/null) = *\ installed ]];
then
	echo "${GRN} $c already installed.  Skipping. ${NC}"
else
	echo "${RED} $c was not found, installing dependencies ${NC}" 2>&1
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
fi

tput reset
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
	 sudo -v; sudo apt-get --allow -y install $c 2>/dev/null
fi
done

cd $DIR/..

echo "${YLLW} Installing dependencies ${NC}"
yarn install > /dev/null 2>&1 &
while kill -0 $! 2> /dev/null; do
    echo -n '.'
    sleep 1
done

fi
