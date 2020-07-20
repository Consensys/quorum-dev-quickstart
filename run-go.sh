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

composeFile="-f go-docker-compose.yml"

echo "Starting network..."
docker-compose ${composeFile} build --pull
docker-compose ${composeFile} up --detach

#list services and endpoints
./list.sh
