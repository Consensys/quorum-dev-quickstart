# Quorum Dev Quickstart


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Usage](#usage)
3. [Dev Network Setups](#dev-network-setups)
    1. [POA Network](#poa-network)
    2. [POA Network with Privacy](#poa-network-privacy)
    3. [Smart Contracts & DApps](#poa-network-dapps)


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

Change directory to the artifacts folder: 

`cd quorum-test-network` (default folder location) 
 
**To start services and the network:**

`./run.sh` starts all the docker containers

**To stop services :**

`./stop.sh` stops the entire network, and you can resume where it left off with `./resume.sh` 

`./remove.sh ` will first stop and then remove all containers and images


## Dev Network Setups
All our documentation can be found on the [GoQuorum documentation site](https://docs.goquorum.consensys.net).

Each setup is comprised of 4 validators, one RPC node and some monitoring tools like:
- [Alethio Lite Explorer](https://besu.hyperledger.org/en/stable/HowTo/Deploy/Lite-Block-Explorer/) to explore blockchain data at the block, transaction, and account level
- [Cakeshop](https://github.com/jpmorganchase/cakeshop) which gives you an integrated development environment and SDK (only with Go based Quorum)

The overall architecture diagrams to visually show components of the blockchain networks is shown below. 
**Consensus Algorithm**: The Go based Quorum variant uses the `IBFT` consensus mechanism a
**Private TX Manager**: The Go based Quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) 

![Image blockchain](./static/blockchain-network.png)
 

### i. POA Network <a name="poa-network"></a>

This is the simplest of the networks available and will spin up a blockchain network comprising 4 validators, 1 RPC 
node which has an [EthSinger](http://docs.ethsigner.consensys.net/) proxy container linked to it so you can optionally sign transactions. To view the progress 
of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Go based Quorum deploys the Cakeshop toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above, bar the yellow privacy block

Use cases: 
 - you are learning about how Ethereum works 
 - you are looking to create a Mainnet or Ropsten node but want to see how it works on a smaller scale
 - you are a DApp Developer looking for a robust, simple network to use as an experimental testing ground for POCs. 
 
 
### ii. POA Network with Privacy <a name="poa-network-privacy"></a>

This network is slightly more advanced than the former and you get everything from the POA network above and a few 
Ethereum clients each paired with a Private Transaction Mananger. The Go based Quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) 
for it's Private Transaction Mananger.

As before, to view the progress of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Go based Quorum deploys the Cakeshop toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above.

Use cases:
- you are learning about how Ethereum works
- you are a user looking to execute private transactions at least one other party
- you are looking to create a private Ethereum network with private transactions between two or more parties.


Once the network is up and running you can send a private transaction between members and verify that other nodes do not see it.
Under the smart_contracts folder there is a `SimpleStorage` contract which can be deployed and tested by running:
```
cd smart_contracts
npm install
node scripts/deploy.js
```
which deploys the contract and sends an arbitrary value (47) from `Member1` to `Member3`. Once done, it queries all three members  
to check the value at an address, and you should observe that only `Member1` & `Member3` have this information as they were involved in the transaction 
and that `Member2` responds with a message saying it cannot find a value.

```
node scripts/deploy.js 
error= null; transactionHash=0x4d7ec1e6135785209b2c7915948b5220c18eecc2b2fd46db3c7f47dce525b05b
Contract transaction send: TransactionHash: 0x4d7ec1e6135785209b2c7915948b5220c18eecc2b2fd46db3c7f47dce525b05b waiting to be mined...
receipt: 0x00fFD3548725459255f1e78A61A07f1539Db0271
newContractInstance address: 0x00fFD3548725459255f1e78A61A07f1539Db0271

Checking each member to verify that the contract has been deployed between members 1 & 3 only...
Member3 value of deployed contract is: 47
Member1 value of deployed contract is: 47
Member2 cannot find any value here.
```


### iii. Smart Contracts & DApps <a name="poa-network-dapps"></a>
- Once you have a network up and running from above, install [metamask](https://metamask.io/) as an extension in your browser
- Once you have setup your own private account, select 'My Accounts' by clicking on the avatar pic and then 'Import Account' and enter the valid private_key
- You can now deploy contracts and connect DApps to the network. 
![Image dapp](./static/qs-dapp.png)

As seen in the architecture overview diagram you can extend the network with monitoring, logging, smart contracts, DApps and so on

As an example we've included the Truffle Pet-Shop Dapp in the `dapps` folder and here is a [video tutorial](https://www.youtube.com/watch?v=_3E9FRJldj8) you 
can follow of deployment to the network and using it. Please import the private key `0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3` to
Metmask **before** proceeding to build and run the DApp with `run-dapp.sh`. Behind the scenes, this has used a smart contract that is compiled and then 
deployed (via a migration) to our test network. The source code for the smart contract and the DApp can be found in the folder `dapps/pet-shop`

When that completes open a new tab in your browser and go to `http://localhost:3001` which opens the Truffle pet-shop box app 
and you can adopt a pet from there. NOTE: Once you have adopted a pet, you can also go to the block explorer `http://localhost:25000` 
and search for the transaction where you can see its details recorded. Metamask will also have a record of any transactions.
