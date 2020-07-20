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

NO_LOCK_REQUIRED=true

. ./.env
. ./.common.sh


PARAMS=""

displayUsage()
{
  echo "This script creates and start a local private Besu network using Docker."
  echo "You can select the consensus mechanism to use.\n"
  echo "Usage: ${me} [OPTIONS]"
  echo "    -c <ibft2|clique>        : the consensus mechanism that you want to run
                                       on your network, default is ethash"
  echo "    -p <offchain|onchain>    : the privacy group mode that you want to run
                                       on your network, default is offchain"
  exit 0
}

composeFile="java-docker-compose"

while getopts "hc:p:" o; do
  case "${o}" in
    h)
      displayUsage
      ;;
    c)
      algo=${OPTARG}
      case "${algo}" in
        ibft2)
          export QS_BESU_CONS_API="IBFT"
          ;;
        clique)
          export QS_BESU_CONS_API="CLIQUE"
          ;;
        *)
          echo "Error: Unsupported consensus value." >&2
          displayUsage
      esac
      export QS_POA_ALGO="${algo}"
      LOCK_FILE=.sampleNetworks.lock
      QS_VERSION=$BESU_VERSION
      ;;
    p)
      privmode=${OPTARG}
      case "${privmode}" in
        onchain)
          export PRIVACY_ONCHAIN_GROUPS_ENABLED=true
          ;;
        offchain)
          export PRIVACY_ONCHAIN_GROUPS_ENABLED=false
          ;;
        *)
          echo -e "Error: Unsupported privacy group mode (must be offchain or onchain).\n" >&2
          displayUsage
        esac
        composeFile="${composeFile}-privacy"
        ;;
    *)
      displayUsage
    ;;
  esac
done

composeFile="-f ${composeFile}.yml"

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
