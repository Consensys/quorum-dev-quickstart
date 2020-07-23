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

npm install
npm start


Orchestrate:
```
docker-compose -f docker-compose-orchestrate-deps.yml up -d
# not sure why this is on a seperate network
docker network create deps_orchestrate
docker-compose -f docker-compose-orchestrate-besu.yml up -d
# can we create this as part of the main compose?
docker volume create --name=deps_vault-token
docker-compose -f docker-compose-orchestrate.yml up -d


```

### Stop Services and Network
`./stop.sh` stops all the docker containers created.

### Remove stopped containers and volumes
`./remove.sh` stops and removes all the containers and volumes.


##TODO:
- orchestrate with java
- orchestrate with quorum
- fix list.sh
- fix images & readme
- add monitoring for go
