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
All our documentation can be found on the [Besu documentation site](https://besu.hyperledger.org/Tutorials/Examples/Private-Network-Example/).

Each quickstart setup is comprised of 4 validators, one RPC node and some monitoring tools like:
- [Alethio Lite Explorer](https://besu.hyperledger.org/en/stable/HowTo/Deploy/Lite-Block-Explorer/) to explore blockchain data at the block, transaction, and account level
- [Metrics monitoring](https://besu.hyperledger.org/en/stable/HowTo/Monitor/Metrics/) via Prometheus and Grafana to give you insights into how the chain is progressing (only with Besu based Quorum)
- Optional [logs monitoring](https://besu.hyperledger.org/en/latest/HowTo/Monitor/Elastic-Stack/) to give you real time logs of the nodes. This feature is enabled with a `-e` flag when starting the sample network

The overall architecture diagrams to visually show components of the blockchain networks is shown below. 
**Consensus Algorithm**: The Besu based Quorum variant uses the `IBFT2` consensus mechanism.
**Private TX Manager**: Both blockchain clients use [Tessera](https://docs.tessera.consensys.net/en/latest/)

![Image blockchain](./static/blockchain-network.png)
 

### i. POA Network <a name="poa-network"></a>

This is the simplest of the networks available and will spin up a blockchain network comprising 4 validators, 1 RPC 
node which has an [EthSinger](http://docs.ethsigner.consensys.net/) proxy container linked to it so you can optionally sign transactions. To view the progress 
of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based Quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, 
paired with Grafana with custom dashboards available on `http://localhost:3000`. 

Essentially you get everything in the architecture diagram above, bar the yellow privacy block

Use cases: 
 - you are learning about how Ethereum works 
 - you are looking to create a Mainnet or Ropsten node but want to see how it works on a smaller scale
 - you are a DApp Developer looking for a robust, simple network to use as an experimental testing ground for POCs. 
 
 
### ii. POA Network with Privacy <a name="poa-network-privacy"></a>

This network is slightly more advanced than the former and you get everything from the POA network above and a few 
Ethereum clients each paired with [Tessera](https://docs.tessera.consensys.net/en/latest/) for its Private Transaction Mananger.

As before, to view the progress of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based Quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, 
paired with Grafana with custom dashboards available on `http://localhost:3000`. 

Essentially you get everything in the architecture diagram above.

Use cases:
- you are learning about how Ethereum works
- you are a user looking to execute private transactions at least one other party
- you are looking to create a private Ethereum network with private transactions between two or more parties.

Once the network is up and running you can send a private transaction between members and verify that other nodes do not see it.
Under the smart_contracts folder there is an `EventEmitter` contract which can be deployed and tested by running:
```
cd smart_contracts
npm install
node scripts/deploy.js
```
which deploys the contract and sends an arbitrary value (47) from `Member1` to `Member3`. Once done, it queries all three members (tessera)
to check the value at an address, and you should observe that only `Member1` & `Member3` have this information as they were involved in the transaction 
and that `Member2` responds with a `0x` to indicate it is unaware of the transaction.

```
node scripts/deploy.js 
Creating contract...
Getting contractAddress from txHash:  0x10e8e9f46c7043f87f92224e065279638523f5b2d9139c28195e1c7e5ac02c72
Waiting for transaction to be mined ...
Contract deployed at address: 0x649f1dff9ca6dfbdd27135c94171334ea0fab5ee

Transaction Hash: 0x30b53a533afe909aee59df716e07f7003c0605075a13f97799b29cdd3c2c42a7
Waiting for transaction to be mined ...
Transaction Hash: 0x181e37e64cdfb8d3cb0f076ee63045981436f3273942bac47820c7ec1aad0c23
Transaction Hash: 0xa27db2772689fe8ca995d32d1753d2695421120c9f171d6d32eb0873f2b96466
Waiting for transaction to be mined ...
Waiting for transaction to be mined ...
Member3 value from deployed contract is: 0x000000000000000000000000000000000000000000000000000000000000002f
Member1 value from deployed contract is: 0x000000000000000000000000000000000000000000000000000000000000002f
Member2 value from deployed contract is: 0x
```

Further [documentation](https://besu.hyperledger.org/en/stable/Tutorials/Privacy/eeajs-Multinode-example/) for this example and a [video tutorial](https://www.youtube.com/watch?v=Menekt6-TEQ) 
is also available.

There is an additional erc20 token example that you can also test with: executing `node example/erc20.js` deploys a `HumanStandardToken` contract and transfers 1 token to Node2.

This can be verified from the `data` field of the `logs` which is `1`.

### iii. Smart Contracts & DApps <a name="poa-network-dapps"></a>
As an example we've included the Truffle Pet-Shop Dapp in the `dapps` folder and here is a [video tutorial](https://www.youtube.com/watch?v=_3E9FRJldj8) you 
can follow of deployment to the network and using it. Please import the private key `0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3` to
Metmask **before** proceeding to build and run the DApp with `run-dapp.sh`. Behind the scenes, this has used a smart contract that is compiled and then 
deployed (via a migration) to our test network. The source code for the smart contract and the DApp can be found in the folder `dapps/pet-shop`


| ⚠️ **WARNING**:  |
| ---  
This is a test account only and the private and public keys are publicly visible. **Using test accounts on Ethereum mainnet and production networks can lead to loss of funds and identity fraud.** In this documentation, we only provide test accounts for ease of testing and learning purposes; never use them for other purposes. **Always secure your Ethereum mainnet and any production account properly.** See for instance [MyCrypto "Protecting Yourself and Your Funds" guide](https://support.mycrypto.com/staying-safe/protecting-yourself-and-your-funds).  | 


![Image dapp](./static/qs-dapp.png)

As seen in the architecture overview diagram you can extend the network with monitoring, logging, smart contracts, DApps and so on

- Once you have a network up and running from above, install [metamask](https://metamask.io/) as an extension in your browser
- Once you have setup your own private account, select 'My Accounts' by clicking on the avatar pic and then 'Import Account' and enter the private key `0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3`
- Build the DApp container and deploy by 
```
cd dapps/pet-shop
./run_dapp.sh
```
When that completes open a new tab in your browser and go to `http://localhost:3001` which opens the Truffle pet-shop box app 
and you can adopt a pet from there. NOTE: Once you have adopted a pet, you can also go to the block explorer `http://localhost:25000` 
and search for the transaction where you can see its details recorded. Metamask will also have a record of any transactions.


