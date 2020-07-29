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

### iii. Orchestrate Network <a name="orchestrate-network"></a>
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

This tutorial will ....
## TODO: specify what the outcome is here

Change directory to the `orchestrate` directory in the artifacts folder: 

`cd quorum-test-network\orchestrate` default folder location 
 
##### Install the Orchestrate cli
```
npm install && npm run orchestrate help 
```

##### Start the network up
This starts the Orchestrate services, as well as other services including Kafka, Redis, Postgres and Hashicorp Vault, and an Ethereum Client node.
```
npm run up
```
```
## TODO: issues with //    "up-orchestrate": "docker-compose up -d ${npm_package_config_services}",
ERROR: No such service: tx-crafter
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! pegasys-orchestrate-quick-start@2.3.0 up-orchestrate: `docker-compose up -d ${npm_package_config_services}`
npm ERR! Exit status 1
```

##### Edit the .env file with details that match your account
## TODO: specify which vars or can we give em some of our test accounts so it works right away?
```
vim .env
```

##### Create an Ethereum account that serves as your **Network Faucet**
```
npm run generate-account
```
which returns (please note the account value will be different in your case)
```
> pegasys-orchestrate-quick-start@2.3.0 generate-account /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/generate-account

0x90494000f242D9e41Cd635939536Aa7aA869CfCF
```
Copy the output of this command and add it to the `.env` file as the value for the `FAUCET_ACCOUNT` variable:
like so: `FAUCET_ACCOUNT=0x90494000f242D9e41Cd635939536Aa7aA869CfCF`
                                                             

##### List accounts stored in Hashicorp Vault
## TODO: specify whats the connection between create an eth account and vault..

```
npm run hashicorp-accounts
```

which returns (please note the key value will be different in your case)
```
> pegasys-orchestrate-quick-start@2.3.0 hashicorp-accounts /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> bash scripts/deps/config/hashicorp/vault.sh kv list secret/default

Keys
----
_0x90494000f242D9e41Cd635939536Aa7aA869CfCF

```

Please note you can also run any other Hashicorp Vault CLI commands by running `npm run hashicorp-vault -- <command>`:
For example, to display the vault token:
`npm run hashicorp-vault -- token lookup`


##### Connect to the blockchain network
Now that you have Orchestrate up and running and an account created, it's time to connect Orchestrate to a blockchain network, by using the REST APIs

```
npm run register-chain
```


which returns (please note the key value will be different in your case)
```
> pegasys-orchestrate-quick-start@2.3.0 register-chain /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/register-chain

{
  uuid: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
  name: 'besu',
  tenantID: '_',
  urls: [ 'http://deps_besu_1:8545' ],
  chainID: '2029',
  listenerDepth: 0,
  listenerCurrentBlock: '329',
  listenerStartingBlock: '329',
  listenerBackOffDuration: '1s',
  listenerExternalTxEnabled: false,
  createdAt: '2020-07-29T03:57:59.698503Z',
  updatedAt: '2020-07-29T03:57:59.698503Z'
}

```
The Chain Unique Identifier (uuid) is displayed in the JSON result. Copy this value and add it to the `.env` file as the value for the `CHAIN_UUID` variable:
like so: `CHAIN_UUID=35e2a951-1f9f-4ad0-9d14-199f5b330dc2`
                                                                                                                                 
Once done, verify that the chain JSON-RPC is being proxied by Orchestrate
```
npm run get-latest-block
```
and the response should be details about the latest mined block on your chain


##### Configure a [Faucet](https://docs.orchestrate.pegasys.tech)
Note: On paid gas networks (for example, public networks such as Ethereum mainnet or Rinkeby and also some private networks, 
such as the Ethereum one used in this quickstart), an Ethereum account must have a positive ETH balance to pay transactions 
fees for mining. Orchestrate provides a faucet to automatically provide the required ETH to accounts managed by Orchestrate

A faucet is defined using a name, a creditor account used to credit other accounts, and a chain identified by its UUID.

The following command uses the CHAIN, CHAIN_UUID and FAUCET_ACCOUNT values from the .env file to create a faucet. 
Here the faucet is named using the chain name suffixed by -faucet.

```
npm run create-faucet
```
which returns
```
> pegasys-orchestrate-quick-start@2.3.0 create-faucet /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/create-faucet

{
  uuid: '47afcb8c-e8bf-4275-a21d-ae29968e10d8',
  name: 'besu-faucet',
  tenantID: '_',
  createdAt: '2020-07-29T03:59:52.783253Z',
  updatedAt: '2020-07-29T03:59:52.783253Z',
  chainRule: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
  creditorAccountAddress: '0x90494000f242D9e41Cd635939536Aa7aA869CfCF',
  maxBalance: '100000000000000000',
  amount: '60000000000000000',
  cooldown: '10s'
}
```


The next thing to do is to add some ETH to your faucet account - this is done by connect Metamask to your Ethereum cleints RPC endpoint ie. 
`http://localhost:8545`. Then import one of the genesis account's private keys and transfer 1 or 2 ETH from one of the test accounts to
your `FAUCET_ACCOUNT` address.







##### Stop the network 

`npm run down`







