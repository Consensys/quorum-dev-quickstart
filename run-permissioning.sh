#!/bin/bash -u

# Copyright 2018 ConsenSys AG.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
# an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

set -e
NO_LOCK_REQUIRED=true

. ./.env
. ./.common.sh

hash jq 2>/dev/null || {
  echo >&2 "This script requires jq but it's not installed."
  echo >&2 "Refer to documentation to fulfill requirements."
  exit 1
}

hash yarn 2>/dev/null || {
  echo >&2 "This script requires yarn but it's not installed."
  echo >&2 "Refer to documentation to fulfill requirements."
  exit 1
}

PARAMS=""

displayUsage()
{
  echo "This script creates and start a local private Besu network using Docker."
  echo "You can select the consensus mechanism to use.\n"
  echo "Usage: ${me} [OPTIONS]"
  echo "    -e                       : setup ELK with the network."
  exit 0
}


# options values and api values are not necessarily identical.
# value to use for ibft2 option as required for Besu --rpc-http-api and --rpc-ws-api
# we want to explicitely display IBFT2 in the sample network options to prevent people from
# being confused with previous version IBFT, however the RPC API remains commons, so the name
# that's the reason of this not obvious mapping.
# variables names must be similar to the option -c|--consensus values to map.
ibft2='ibft'
composeFile="docker-compose_permissioning_poa"

while getopts "he" o; do
  case "${o}" in
    h)
      displayUsage
      ;;
    e)
      elk_compose="${composeFile/docker-compose/docker-compose_elk}"
      composeFile="$elk_compose"
      ;;
    *)
      displayUsage
    ;;
  esac
done

composeFile="-f ${composeFile}.yml"

echo "Checkout smart contracts and compile to get deployedByteCode to put into genesis file"
if [[ ! -d permissioning-smart-contracts ]]; then
  git clone https://github.com/PegaSysEng/permissioning-smart-contracts
fi
cd permissioning-smart-contracts

if [ $? -eq 1 ]
then
   echo "Error: Could not checkout repo PegaSysEng/permissioning-smart-contracts. Unable to proceed"
   exit 1
fi

git pull
yarn install
yarn run build
cd ..

# compile the code and set it in the genesis file
rm -f config/besu/ibft2GenesisPermissioning.json
cp config/besu/ibft2GenesisPermissioning.json.template config/besu/ibft2GenesisPermissioning.json
node_ingress_code=`cat permissioning-smart-contracts/src/chain/abis/NodeIngress.json | jq '.["deployedBytecode"]'`
account_ingress_code=`cat permissioning-smart-contracts/src/chain/abis/AccountIngress.json | jq '.["deployedBytecode"]'`
# BSD specific sed
if [ "$(uname)" == "Darwin" ]; then
  sed -i '' -e "s/NODE_INGRESS_CODE/$node_ingress_code/g" config/besu/ibft2GenesisPermissioning.json
  sed -i '' -e "s/ACCOUNT_INGRESS_CODE/$account_ingress_code/g" config/besu/ibft2GenesisPermissioning.json
else
  sed -i "s/NODE_INGRESS_CODE/$node_ingress_code/g" config/besu/ibft2GenesisPermissioning.json
  sed -i "s/ACCOUNT_INGRESS_CODE/$account_ingress_code/g" config/besu/ibft2GenesisPermissioning.json
fi

# Build and run containers and network
echo "${composeFile}" > ${LOCK_FILE}
echo "${QS_VERSION}" >> ${LOCK_FILE}

echo "${bold}*************************************"
echo "Sample Network for Besu at ${QS_VERSION}"
echo "*************************************${normal}"
echo "Start network"
echo "--------------------"

echo "Starting network..."
docker-compose ${composeFile} build --pull
docker-compose ${composeFile} up --detach

#list services and endpoints
./list.sh
