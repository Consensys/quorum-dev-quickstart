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

NO_LOCK_REQUIRED=false

. ./.env
. ./.common.sh

removeDockerImage(){
  if [[ ! -z `docker ps -a | grep $1` ]]; then
    docker image rm $1
  fi
}

echo "${bold}*************************************"
echo "Sample Network for Besu at ${version}"
echo "*************************************${normal}"
echo "Stop and remove network..."
docker-compose ${composeFile} down -v
docker-compose ${composeFile} rm -sfv

docker image rm sample-network/besu:${version}
docker image rm sample-network/block-explorer-light:${version}
docker image rm pegasyseng/orion:develop
docker image rm hyperledger/besu:${BESU_VERSION}

# elk
if [[ ! -z `docker ps -a | grep besu-sample-network_filebeat` ]]; then
  removeDockerImage besu-sample-network_filebeat
fi
if [[ ! -z `docker ps -a | grep besu-sample-network_metricbeat` ]]; then
  removeDockerImage besu-sample-network_metricbeat
fi
if [[ ! -z `docker ps -a | grep besu-sample-network_logstash` ]]; then
  removeDockerImage besu-sample-network_logstash
fi
if [[ ! -z `docker ps -a | grep besu-sample-network_elasticsearch` ]]; then
  removeDockerImage besu-sample-network_elasticsearch
fi

# pet shop dapp
if [[ ! -z `docker ps -a | grep besu-sample-network_pet_shop` ]]; then
  docker stop besu-sample-network_pet_shop
  docker rm besu-sample-network_pet_shop
  removeDockerImage besu-sample-network_pet_shop
fi

# clean up permissioning
if [[ ! -z `docker ps -a | grep besu-sample-network_permissioning_dapp` ]]; then
  docker stop besu-sample-network_permissioning_dapp
  docker rm besu-sample-network_permissioning_dapp
  removeDockerImage besu-sample-network_permissioning_dapp
fi
rm -rf permissioning-dapp/build
rm -rf permissioning-smart-contracts
rm -f config/besu/ibft2GenesisPermissioning.json

rm ${LOCK_FILE}
echo "Lock file ${LOCK_FILE} removed"
