#!/bin/bash
set -e

hash truffle 2>/dev/null || {
  echo >&2 "This script requires truffle but it's not installed."
  echo >&2 "Refer to documentation to fulfill requirements."
  exit 1
}

rm -rf pet-shop-box
git clone https://github.com/truffle-box/pet-shop-box.git
cp -r custom_config/* ./pet-shop-box/

cd pet-shop-box/
npm install
npm install @truffle/hdwallet-provider@1.2.6
npm install truffle

truffle compile
truffle migrate --network quickstartWallet
truffle test --network quickstartWallet

docker build . -t quorum-dev-quickstart_pet_shop
docker run -p 3001:3001 --name quorum-dev-quickstart_pet_shop --detach quorum-dev-quickstart_pet_shop

