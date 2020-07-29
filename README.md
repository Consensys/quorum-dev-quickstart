# Quorum Dev Quickstart


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Usage](#usage)
3. [Dev Network Setups](#dev-network-setups)
    1. [POA Network](#poa-network)
    2. [POA Network with Privacy](#poa-network-privacy)
    3. [Orchestrate Network](#orchestrate-network)


## Prerequisites

To run these tutorials, you must have the following installed:

- [Docker and Docker-compose](https://docs.docker.com/compose/install/)

| ⚠️ **Note**: If on MacOS or Windows, please ensure that you allow docker to use upto 4G of memory or 6G if running Privacy examples under the _Resources_ section. The [Docker for Mac](https://docs.docker.com/docker-for-mac/) and [Docker Desktop](https://docs.docker.com/docker-for-windows/) sites have details on how to do this at the "Resources" heading       |
| ---                                                                                                                                                                                                                                                                                                                                                                                |


| ⚠️ **Note**: This has only been tested on Windows 10 Build 18362 and Docker >= 17.12.2                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                                                                                                                                                                                                                                                                |

- On Windows ensure that the drive that this repo is cloned onto is a "Shared Drive" with Docker Desktop
- On Windows we recommend running all commands from GitBash
- [Nodejs](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)



## Usage 

Create the docker-compose file and artifacts with 

`npm install && npm start` 

This prompts you to pick a quorum variant, whether you would like to try Privacy and the location for the artifacts
Change directory to the artifacts folder: 

`cd quorum-test-network` default folder location 
 
**To start services and the network:**

`./run.sh` starts all the docker containers

**To stop services :**

`./stop.sh` stops the entire network, and you can resume where it left off with `./resume.sh` 

`./remove.sh ` will first stop and then remove all containers and images


## Dev Network Setups
All our documentation can be found on the [Besu documentation site](https://besu.hyperledger.org/Tutorials/Examples/Private-Network-Example/).

There are multiple examples in this repo, and you can pick either Go Quorum or Hyperledger Besu as the Ethereum client. 
Each setup comprises 4 validators, one RPC node and some monitoring tools like:
- [Alethio Lite Explorer](https://besu.hyperledger.org/en/stable/HowTo/Deploy/Lite-Block-Explorer/) to explore blockchain data at the block, transaction, and account level
- [Metrics monitoring](https://besu.hyperledger.org/en/stable/HowTo/Monitor/Metrics/) via prometheus and grafana to give you insights into how the chain is progressing (only with Besu based quorum)
- [Cakeshop](https://github.com/jpmorganchase/cakeshop) which gives you an integrated development environment and SDK (only with Go based quorum)
- Optional [logs monitoring](https://besu.hyperledger.org/en/latest/HowTo/Monitor/Elastic-Stack/) to give you real time logs of the nodes. This feature is enabled with a `-e` flag when starting the sample network

The overall architecture diagrams to visually show components of the blockchain networks is shown below. 
**Consensus Algorithm**: The Go based quorum variant uses the `IBFT` consensus mechanism and the Besu based quorum variant uses the `IBFT2` consensus mechanism.
**Private TX Manager**: The Go based quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) and the Besu based quorum variant uses [Orion](https://github.com/PegaSysEng/orion)

![Image blockchain](./static/blockchain-network.png)
 

### i. POA Network <a name="poa-network"></a>

This is the simplest of the networks avialable and will spin up a blockchain network comprising 4 validators, 1 RPC node which has an EthSinger proxy container linked to it so you can optionally sign transactions. 
To view the progress of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, paired with Grafana with custom dashboards available on `http://localhost:3000`. 
Go based Quorum deploys the Cakeshop toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above, bar the yellow privacy block

 
### ii. POA Network with Privacy <a name="poa-network-privacy"></a>

This network is slightly more advanced than the former and you get everything from the POA network above and a few 
Ethereum clients each paired with a Private Transaction Mananger. The Go based quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) 
and the Besu based quorum variant uses [Orion](https://github.com/PegaSysEng/orion) for it's Private Transaction Mananger.

As before, to view the progress of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, paired with Grafana with custom dashboards available on `http://localhost:3000`. 
Go based Quorum deploys the Cakeshop toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above.

### ii. Orchestrate Network <a name="orchestrate-network"></a>
Orchestrate is a platform that enables enterprises to easily build secure and reliable applications on Ethereum blockchains. 
It provides advanced features when connected to blockchain networks like:
- Transaction management (transaction crafting, gas management, nonce management, and transaction listening)
- Account management with private key storage in Hashicorp Vault
- Smart contract registry
- Public and private transactions
- Multi-chain.

For more information, refer to the PegaSys Orchestrate official Documentation.

| ⚠️ **Note**: Orchestate is available free of charge for a trial period. To get access to the artifacts and continue, please create a free account HERE    |
| ---      


The quickstart connects to an Ethereum client, in this dev setup we use only one node, however if your system has enough resources 
you are welcome to spin a full multi node network instead. All you need is an RPC endpoint that you connect Orchestrate to

Change directory to the artifacts folder: 

`cd quorum-test-network` default folder location 
 
**To start services and the network:**

`./run.sh` starts all the docker containers


#### Orchestate Tutorial

##### Install the Orchestrate cli
```
cd orchestrate/orchestrate
npm install && npm run orchestrate help 
```

##### 0. Edit the .env file with details that match your account
## TODO: specify which vars or can we give em some of our test accounts so it works right away?
```
vim .env
```

##### 1. Create an Ethereum account that serves as your **Network Faucet**
```
npm run generate-account
```

Copy the output of this command and add it to the `.env` file as the value for the `FAUCET_ACCOUNT` variable:

Example: `FAUCET_ACCOUNT=0x6230592812dE2E256D1512504c3E8A3C49975f07`
                                                             



**To stop services :**

`./stop.sh` stops the entire network, and you can resume where it left off with `./resume.sh` 

`./remove.sh ` will first stop and then remove all containers and images





## TODO:

```
docker-compose -f docker-compose-deps.yml up -d
docker-compose -f docker-compose.yml up -d

# change the external deps with the name of the folder you deploy to at the bottom of docker-compose.yml

# to install the orchestrate cli
cd orchestrate/orchestrate
npm install && npm run orchestrate help 

```


### Stop Services and Network
`./stop.sh` stops all the docker containers created.

### Remove stopped containers and volumes
`./remove.sh` stops and removes all the containers and volumes.


##TODO:
- fix list.sh
- fix images & readme
- add monitoring for go
- cakeshop
