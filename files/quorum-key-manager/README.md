# Quorum Key Manager Quickstart

Quorum Key Manager (QKM) is a key management service that exposes an HTTP API service to manage your secrets, keys and Ethereum accounts. QKM supports the integration with
*AWS Key Management Service*, *Azure Key Vault* and *HashiCorp Vault*. 

In addition, using the JSON-RPC interface of the QKM, you can connect to your Ethereum nodes to sign your transaction using the Ethereum account stored in your secure key vault.

Quorum Key Manager is developed under the [BSL 1.1](LICENSE) license and written in Go. 

For more information, refer to the Quorum Key Manager official [Documentation](https://docs.quorum-key-manager.consensys.net/).


| ⚠️ **Note**: If you have an existing Quorum quickstart running, please stop it before proceeding. The Orchestrate quickstart spins up an Ethereum client which serves as an RPC endpoint. If you have an existing RPC endpoint, please update the `NETWORK_ENDPOINT` in the `.env` file and comment out the eth_client container in the file `<output_folder>/orchestrate/scripts/deps/docker-compose.yml` |
| ---


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment setup](#environment-setup)
3. [HTTP API](#http-api)


## Prerequisites

To run these tutorials, you must have the following installed:

- [Docker and Docker-compose](https://docs.docker.com/compose/install/)

| ⚠️ **Note**: If on MacOS or Windows, please ensure that you allow docker to use upto 4G of memory or 6G if running Privacy examples under the _Resources_ section. The [Docker for Mac](https://docs.docker.com/docker-for-mac/) and [Docker Desktop](https://docs.docker.com/docker-for-windows/) sites have details on how to do this at the "Resources" heading       |
| ---


| ⚠️ **Note**: This has only been tested on Windows 10 Build 18362 and Docker >= 17.12.2
| ---

- On Windows ensure that the drive, that this repo is cloned onto, is a "Shared Drive" with Docker Desktop
- On Windows we recommend running all commands from GitBash
- [Nodejs](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)


## Environment setup

**Start service dependencies**

We start Postgres and Hashicorp Vault service as part of Quorum Key Manager dependencies:
```bash
$> docker-compose -f docker-compose.dev.yml -d up 
```

**Start selected network**

We start the selected network (GoQuorum|Besu):
```bash
$> cd ./network
$> ./run.sh
...
```

Then we go back to root folder
```bash
$> cd ...
```


To see more option information about the running underline network, see [README.md](./network/README.md)
 
**Start Quorum Key Manager:**

Once dependencies and network are running we can start Quorum Key Manager service:
```
$> docker-compose up -d
```


## HTTP-API

Quorum Key Manager is exposing a HTTP API which it is documented in [https://consensys.github.io/quorum-key-manager](https://consensys.github.io/quorum-key-manager) 
