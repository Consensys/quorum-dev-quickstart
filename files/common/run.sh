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
  echo "This script creates and start a local private Ethereum network using Docker."
  echo "You can select ONE of the quorum mechanism to use ie. java or go.\n"
  echo "Usage: ${me} [OPTIONS]"
  echo "    -j                       : java based quorum with Hyperledger Besu"
  echo "    -g                       : go based quorum with goQuorum"
  echo "    -p                       : with private transaction management support"
  exit 0
}

composeFile="java-docker-compose"
quorum=""
quorumErrorMessage="${bold}Only ONE of j or g quorum options is allowed${normal}"

while getopts "hpjgc:" o; do
  case "${o}" in
    h)
      displayUsage
      ;;
    j)
      if [[ $quorum = "" ]] ; then quorum=java  ; else  echo $quorumErrorMessage && displayUsage ; exit 1 ; fi
      composeFile="java-docker-compose"
      ;;
    g)
      if [[ $quorum = "" ]] ; then quorum=go  ; else  echo $quorumErrorMessage && displayUsage ; exit 1 ; fi
      composeFile="go-docker-compose"
      ;;
    p)
      composeFile="${composeFile}-privacy"
      ;;
    *)
      displayUsage
    ;;
  esac
done

if [[ $quorum = "" ]] ; then quorum=java  ; fi
composeFile="-f ${composeFile}.yml"

# Build and run containers and network
echo "${composeFile}" > ${LOCK_FILE}

echo "${bold}*************************************"
echo "Quorum Dev Quickstart with $quorum based quorum"
echo "*************************************${normal}"
echo "Start network"
echo "--------------------"

echo "Starting network..."
docker-compose ${composeFile} build --pull
docker-compose ${composeFile} up --detach

#list services and endpoints
./list.sh
