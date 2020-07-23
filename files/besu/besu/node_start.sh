#!/bin/sh -e

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


# sleep loop to wait for the public key file to be written
while [ ! -f "/opt/besu/public-keys/bootnode_pubkey" ]
do
  sleep 1
done

rm -rf /opt/besu/database

bootnode_pubkey=`sed 's/^0x//' /opt/besu/public-keys/bootnode_pubkey`
boonode_ip=`getent hosts validator1 | awk '{ print $1 }'`
bootnode_enode_address="enode://${bootnode_pubkey}@${boonode_ip}:30303"

p2pip=`awk 'END{print $1}' /etc/hosts`

/opt/besu/bin/besu $@ --bootnodes=$bootnode_enode_address --p2p-host=$p2pip

