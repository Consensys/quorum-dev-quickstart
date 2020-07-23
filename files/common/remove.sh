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
echo "Quorum Dev Quickstart "
echo "*************************************${normal}"
echo "Stop and remove network..."
docker-compose down -v
docker-compose rm -sfv

docker image rm quorum-dev-quickstart/besu:${BESU_VERSION}
docker image rm quorum-dev-quickstart/block-explorer-light:develop
docker image rm pegasyseng/orion:develop
docker image rm hyperledger/besu:${BESU_VERSION}
docker image rm quorumengineering/quorum:${QUORUM_VERSION}
docker image rm quorumengineering/tessera:${QUORUM_TESSERA_VERSION}

rm ${LOCK_FILE}
echo "Lock file ${LOCK_FILE} removed"
