# Sample Networks

## Prerequisites

To run these tutorials, you must have the following installed:

- [Docker and Docker-compose](https://docs.docker.com/compose/install/)

| ⚠️ **Note**: If on MacOS or Windows, please ensure that you allow docker to use upto 4G of memory or 6G if running Privacy examples under the _Resources_ section. The [Docker for Mac](https://docs.docker.com/docker-for-mac/) and [Docker Desktop](https://docs.docker.com/docker-for-windows/) sites have details on how to do this at the "Resources" heading       |
| ---                                                                                                                                                                                                                                                                                                                                                                                |


| ⚠️ **Note**: This has only been tested on Windows 10 Build 18362 and Docker >= 17.12.2                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                                                                                                                                                                                                                                                                |

- On Windows ensure that the drive that this repo is cloned onto is a "Shared Drive" with Docker Desktop
- On Windows we recommend running all commands from GitBash
- [Nodejs](https://nodejs.org/en/download/) and [Truffle](https://www.trufflesuite.com/truffle) if using the DApp


## Description

### Java based Quorum:
`./run.sh` 
`./run.sh -c clique` defaults to ibft2
`./run.sh -p onchain` privacy

### Geth based Quorum:
source .env && PRIVATE_CONFIG=ignore docker-compose -f go-docker-compose.yml up
source .env && docker-compose -f go-docker-compose-privacy.yml up




### Stop Services and Network
`./stop.sh` stops all the docker containers created.

### Remove stopped containers and volumes
`./remove.sh` stops and removes all the containers and volumes.

geth --identity node1-istanbul --datadir /qdata/dd --permissioned --nodiscover --verbosity 5 --networkid 10 --rpc --rpccorsdomain '*' --rpcvhosts '*' --rpcaddr 0.0.0.0 --rpcport 8545 --rpcapi admin,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul --port 21000 --unlock 0 --allow-insecure-unlock --nousb --password /examples/passwords.txt --emitcheckpoints --istanbul.blockperiod 1 --mine --minerthreads 1 --syncmode full
