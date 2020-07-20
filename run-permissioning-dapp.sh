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

. ./.env
. ./.common.sh

hash yarn 2>/dev/null || {
  echo >&2 "This script requires yarn but it's not installed."
  echo >&2 "Refer to documentation to fulfill requirements."
  exit 1
}

composeFile="docker-compose_permissioning_poa"

displayUsage()
{
  echo "This script creates and start a local private Besu network using Docker."
  echo "You can select the consensus mechanism to use.\n"
  echo "Usage: ${me} [OPTIONS]"
  echo "    -e                       : setup ELK with the network."
  exit 0
}

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

# migrate the contracts
# Onchain permissioning uses smart contracts to store and maintain the node, account, and admin whitelists.
# Using onchain permissioning enables all nodes to read the whitelists from a single source, the blockchain.
# 1. Ingress contracts for nodes and accounts - proxy contracts defined in the genesis file that defer the permissioning logic
# to the Node Rules and Account Rules contracts. The Ingress contracts are deployed to static addresses.
# 2. Node Rules - stores the node whitelist and node whitelist operations (for example, add and remove).
# 3. Account Rules - stores the accounts whitelist and account whitelist operations (for example, add and remove).
# 4. Admin - stores the list of admin accounts and admin list operations (for example, add and remove).
# There is one list of admin accounts for node and accounts.
echo "Migrating contracts..."
cd permissioning-smart-contracts
NODE_INGRESS_CONTRACT_ADDRESS="0x0000000000000000000000000000000000009999" \
 ACCOUNT_INGRESS_CONTRACT_ADDRESS="0x0000000000000000000000000000000000008888" \
  BESU_NODE_PERM_ACCOUNT="0x627306090abaB3A6e1400e9345bC60c78a8BEf57" \
   BESU_NODE_PERM_KEY="0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3" \
    BESU_NODE_PERM_ENDPOINT="http://localhost:8545" \
     INITIAL_WHITELISTED_ACCOUNTS=0xfe3b557e8fb62b89f4916b721be55ceb828dbd73,0x627306090abab3a6e1400e9345bc60c78a8bef57 \
      INITIAL_WHITELISTED_NODES=enode://c1979a8a48693db804316b5acebe35e11731e1fb1c9c21ff7268ab25db6f6e03390a429b83cf0ec0865a7205f2669ec1ace652a3def11e2e01571c74939cbe22@172.24.2.5:30303,enode://e40129f02c9e29a02049668346d4777bb55809042746882b33b20a8b5a7310eb5f107a53f0aa3da766ee77f401557a79c0c328329ea48bf0996c6c9dff817f76@172.24.2.6:30303,enode://a3e4af081a0ab853c959b9acd0596f818b91a9409b9d04c50af055072c929abfa340e14111dcfa76e049fdb16bb9198e722d5e7be3e8ef37562ea0d0ce1eda11@172.24.2.7:30303,enode://8f4e444a73034236ab4244c7a572aa2c6198b9e0d483ef17bf4b751cac5c0370bc527a5b0c5d01aa3ef41704af838c74730aeecac0f0c22dc4c17b0a9f03ad76@172.24.2.8:30303,enode://51729f1b4186db1701e13d9e71b7b4f0a35e0cc1f480c904c5e758b5b76936685dccde490c623a79f6c6c5d1dfd3eae37d35101e1a9a2d06536074562dd77604@172.24.2.9:30303,enode://09b02f8a5fddd222ade4ea4528faefc399623af3f736be3c44f03e2df22fb792f3931a4d9573d333ca74343305762a753388c3422a86d98b713fc91c1ea04842@172.24.2.11:30303,enode://af80b90d25145da28c583359beb47b21796b2fe1a23c1511e443e7a64dfdb27d7434c380f0aa4c500e220aa1a9d068514b1ff4d5019e624e7ba1efe82b340a59@172.24.2.12:30303 \
        yarn truffle migrate --reset
mv build/ ../permissioning-dapp/

# run the dapp
# The Permissioning Management Dapp is provided to view and maintain the whitelists.
# 1. Accounts can submit transactions to the network
# 2. Nodes can participate in the network
# 3. Admins are accounts that can update the accounts and nodes whitelists
cd ../permissioning-dapp
docker build . -t besu-sample-network_permissioning_dapp
docker run -p 3001:80 -e BESU_NODE_PERM_ACCOUNT="0x627306090abaB3A6e1400e9345bC60c78a8BEf57" \
                      -e BESU_NODE_PERM_KEY="0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3" \
                      -e BESU_NODE_PERM_ENDPOINT="http://localhost:8545" \
                      -e NODE_ENV=development --name besu-sample-network_permissioning_dapp --detach besu-sample-network_permissioning_dapp
cd ..
sleep 30

# do a restart in normal terms - here we do a start and stop with the env var PERMISSIONING_ENABLED=true
echo "Restarting the nodes to enable permissioning..."
./stop.sh
sleep 60
echo "----------------------------------"
echo "Starting network up again..."
echo "----------------------------------"
PERMISSIONING_ENABLED=true docker-compose -f  ${composeFile}.yml up -d bootnode
sleep 60
PERMISSIONING_ENABLED=true docker-compose -f ${composeFile}.yml up -d
