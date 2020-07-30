#!/bin/bash

hash truffle 2>/dev/null || {
  echo >&2 "This script requires truffle but it's not installed."
  echo >&2 "Refer to documentation to fulfill requirements."
  exit 1
}

git clone https://github.com/truffle-box/pet-shop-box.git ./
mv custom_config/* ./

npm install
npm install truffle
npm install @truffle/hdwallet-provider

truffle migrate --network quickstartWallet
truffle test --network quickstartWallet

docker build . -t quorum-dev-quickstart_pet_shop
docker run -p 3001:3001 --name quorum-dev-quickstart_pet_shop --detach quorum-dev-quickstart_pet_shop

