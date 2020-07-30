# Quorum Dev Quickstart


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Usage](#usage)
3. [Dev Network Setups](#dev-network-setups)
    1. [POA Network](#poa-network)
    2. [POA Network with Privacy](#poa-network-privacy)
    3. [Smart Contracts & DApps](#poa-network-dapps)
    4. [Orchestrate Network](#orchestrate-network)
        1. [Deploy contracts & send transactions](#orchestrate-contracts)
        2. [Multitenancy](#orchestrate-multitenancy)
                  

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
**Consensus Algorithm**: The Go based quorum variant uses the `IBFT` consensus mechanism and the Besu based quorum 
variant uses the `IBFT2` consensus mechanism.
**Private TX Manager**: The Go based quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) and the 
Besu based quorum variant uses [Orion](https://github.com/PegaSysEng/orion)

![Image blockchain](./static/blockchain-network.png)
 

### i. POA Network <a name="poa-network"></a>

This is the simplest of the networks avialable and will spin up a blockchain network comprising 4 validators, 1 RPC 
node which has an EthSinger proxy container linked to it so you can optionally sign transactions. To view the progress 
of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, 
paired with Grafana with custom dashboards available on `http://localhost:3000`. Go based Quorum deploys the Cakeshop 
toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above, bar the yellow privacy block

 
### ii. POA Network with Privacy <a name="poa-network-privacy"></a>

This network is slightly more advanced than the former and you get everything from the POA network above and a few 
Ethereum clients each paired with a Private Transaction Mananger. The Go based quorum variant uses [Tessera](https://github.com/jpmorganchase/tessera) 
and the Besu based quorum variant uses [Orion](https://github.com/PegaSysEng/orion) for it's Private Transaction Mananger.

As before, to view the progress of the network, the Alethio block explorer can be used and is available on `http://localhost:25000`. 
Hyperledger Besu based quorum also deploys metrics monitoring via Prometheus available on `http://localhost:9090`, 
paired with Grafana with custom dashboards available on `http://localhost:3000`. Go based Quorum deploys the Cakeshop 
toolkit available on `http://localhost:8999`

Essentially you get everything in the architecture diagram above.


### iii. Smart Contracts & DApps <a name="poa-network-dapps"></a>
- Once you have a network up and running from above, install [metamask](https://metamask.io/) as an extension in your browser
- Once you have setup your own private account, select 'My Accounts' by clicking on the avatar pic and then 'Import Account' and enter the valid private_key
- You can now deploy contracts and connect DApps to the network. 
![Image dapp](./static/qs-dapp.png)

As seen in the architecture overview diagram you can extend the network with monitoring, logging, smart contracts, DApps and so on

As an example we've included the Truffle Pet-Shop Dapp in the `dapps` folder and here is a [video tutorial](https://www.youtube.com/watch?v=_3E9FRJldj8) you 
can follow of deployment to the network and using it. Please import the private key `0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3` to
Metmask before proceeding to build and run the DApp with `build-dapp.sh`.

When that completes open a new tab in your browser and go to `http://localhost:3001` which opens the Truffle pet-shop box app 
and you can adopt a pet from there. NOTE: Once you have adopted a pet, you can also go to the block explorer `http://localhost:25000` 
and search for the transaction where you can see its details recorded. Metamask will also have a record of any transactions.


### iv. Orchestrate Network <a name="orchestrate-network"></a>
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


The quickstart connects to an Ethereum client, in this dev setup we use only one node, however if your system has enough 
resources you are welcome to spin a full multi node network instead. All you need is an RPC endpoint that you connect 
Orchestrate to

This tutorial will show you how to connect Orchestate to a blockchain network and use the Contract Registry to deploy 
smart contracts, send transactions etc 

Change directory to the `orchestrate` directory in the artifacts folder: 

`cd quorum-test-network\orchestrate` default folder location 
 
##### Install the Orchestrate cli
```
npm install && npm run orchestrate help 
```

##### Start the network up
This starts the Orchestrate services, as well as other services including Kafka, Redis, Postgres and Hashicorp Vault, 
and an Ethereum Client node.
```
npm run up
```

##### Check the .env file with details that match your account (if required)
```
vim .env
```

### a. Deploy contracts & send transactions <a name="orchestrate-contracts"></a>

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
Copy the output of this command and add it to the `.env` file as the value for the `FAUCET_ACCOUNT` variable, like so: 
`FAUCET_ACCOUNT=0x90494000f242D9e41Cd635939536Aa7aA869CfCF`
                                                             

##### List accounts stored in Hashicorp Vault
The faucet account's private key is stored in Hashicorp Vault and it's Ethereum address can be obtained by
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

Please note you can also run any other Hashicorp Vault CLI commands by running `npm run hashicorp-vault -- <command>`

For example, to display the vault token:
`npm run hashicorp-vault -- token lookup`


##### Connect to the blockchain network
Now that you have Orchestrate up and running and an account created, it's time to connect Orchestrate to a blockchain 
network, by using the REST APIs

```
npm run register-chain
```


which returns (please note the key value will be different in your case)
```
> pegasys-orchestrate-quick-start@2.3.0 register-chain /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/register-chain

{
  uuid: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
  name: 'dev',
  tenantID: '_',
  urls: [ 'http://deps_eth-client_1:8545' ],
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
The Chain Unique Identifier (uuid) is displayed in the JSON result. Copy this value and add it to the `.env` file as 
the value for the `CHAIN_UUID` variable, like so: `CHAIN_UUID=35e2a951-1f9f-4ad0-9d14-199f5b330dc2`
                                                                                                                                 
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

The next thing to do is to add some ETH to your faucet account - this is done by connect Metamask to your Ethereum 
clients RPC endpoint ie. `http://localhost:8545`. Then import one of the genesis account's private keys and transfer 1 
or 2 ETH from one of the test accounts to your `FAUCET_ACCOUNT` address.

![Image metamask_faucet](./static/metamask-faucet-transfer.png)

##### Register the smart contract 
Orchestrate provides a contract registry which you can use to deploy contracts on your registered networks. But first 
you have to create, compile, and add your contract to the registry.

So, first we compile the contracts 
```
npm run compile
```
which returns
```
> pegasys-orchestrate-quick-start@2.3.0 compile /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> truffle compile


Compiling your contracts...
===========================
> Compiling ./smart-contracts/Counter.sol
> Artifacts written to /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate/build/contracts
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```

Then we send it to the Contract Registry
```
npm run register-contract
```
which returns
``` 
> pegasys-orchestrate-quick-start@2.3.0 register-contract /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/register-contract

{
  name: 'Counter',
  tag: 'latest',
  abi: [
    {
      anonymous: false,
      inputs: [Array],
      name: 'Incremented',
      type: 'event'
    },
    {
      constant: false,
      inputs: [Array],
      name: 'increment',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ],
  bytecode: '0x6080604052348015600f57600080fd5b5061010a8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80637cf5dab014602d575b600080fd5b605660048036036020811015604157600080fd5b81019080803590602001909291905050506058565b005b8060008082825401925050819055507f38ac789ed44572701765277c4d0970f2db1c1a571ed39e84358095ae4eaa54203382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15056fea265627a7a72315820302e34d4ab81c03f1e9b3c7a9a3933bfa023ee991843ebe212da27a0533e593564736f6c63430005100032',
  deployedBytecode: '0x6080604052348015600f57600080fd5b506004361060285760003560e01c80637cf5dab014602d575b600080fd5b605660048036036020811015604157600080fd5b81019080803590602001909291905050506058565b005b8060008082825401925050819055507f38ac789ed44572701765277c4d0970f2db1c1a571ed39e84358095ae4eaa54203382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15056fea265627a7a72315820302e34d4ab81c03f1e9b3c7a9a3933bfa023ee991843ebe212da27a0533e593564736f6c63430005100032'
}

```

To query the Contract Registry for a list of Smart Contracts:
```
npm run get-catalog
```
which returns
``` 
> pegasys-orchestrate-quick-start@2.3.0 get-catalog /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/get-catalog

[ 'Counter' ]
```

##### Create an account to send transactions 
 Generate an account to be used for sending transactions to the smart contact. The generated account is stored by the 
 Hashicorp Vault service.

```
npm run  generate-account
```
which returns
``` 
> pegasys-orchestrate-quick-start@2.3.0 generate-account /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/generate-account

0xF0156f5949e4667E5396D41ff22616EDc21f0150
```

Note: The generated account is automatically funded by the faucet service configured previously. Copy the account addresss 
and set the FROM_ACCOUNT value with this address in .env file, like so: `FROM_ACCOUNT=0xF0156f5949e4667E5396D41ff22616EDc21f0150`
                                                                                                                                     


##### Deploy the contract and send transactions 

Orchestrate manages blockchain transactions that are asynchronous by nature due to blockchain mining time. Orchestrate 
provides an event consumer to process transaction receipts when they are generated, and uses Apache Kafka to handle these 
asynchronous communications.

In the next steps, we send two kinds of transactions:
- Create the contract on the chain
- Interact with the contract by send a transaction to it

You have to run a consumer script to listen to the transaction receipt events and see them happen on the network. In your 
current terminal, start the consumer and let the consumer run in the foreground:
```
npm run  consume
```

In another terminal session, deploy the smart contract
```
npm run  deploy
```
After a few seconds (depending on block time), you see the receipt related to the contract creation transaction in the consumer terminal.
which returns
``` 
> pegasys-orchestrate-quick-start@2.3.0 generate-account /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/deploy-contract

Transaction request sent with id:  2b8bcb4c-d1fa-11ea-87d0-0242ac130003
```
and the consumer window will have a transaction receipt
``` 
> pegasys-orchestrate-quick-start@2.3.0 generate-account /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/consume

Transaction ID:  2b8bcb4c-d1fa-11ea-87d0-0242ac130003
Transaction receipt: {
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 312,
  "txIndex": 2,
  "txHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "status": true,
  "contractAddress": "0xA94F5374fCE5EDBC8E2A8697C15331677D6EBF0B",
  "cumulativeGasUsed": 153925,
  "gasUsed": 110813,
  "postState": "0x",
  "bloom": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "logs": undefined
}
```
Copy the contractAddress in the receipt and set the TO_ACCOUNT value with this address in .env file, like so: 
`TO_ACCOUNT=0xA94F5374fCE5EDBC8E2A8697C15331677D6EBF0B`


##### Send a Transaction to the Smart Contract
> **Important:** Before moving forward, ensure the FROM_ACCOUNT and TO_ACCOUNT are set in the .env file.

On the second terminal, send the transaction:
```
npm run send-tx
```
After a few seconds you will see the transaction request id, and the transaction receipt in the consumer output on the 
first terminal as before
``` 
> pegasys-orchestrate-quick-start@2.3.0 generate-account /home/jfernandes/workspace/quorum-dev-quickstart/quorum-test-network/orchestrate
> dotenv ts-node src/send-tx

Transaction request sent with id:  ccd86e78-d1fb-11ea-87d0-0242ac130003
```

This concludes the first tutorial on how to deploy contracts and send transactions.

##### To stop the network 
```
npm run down
```

### b. Multitenancy <a name="orchestrate-multitenancy"></a>

Multi-tenancy enables serving multiple blockchain applications with a single Orchestrate instance. Resources including 
transaction streams, access to the blockchain network, private keys, and smart contracts are isolated to the tenant that 
owns them. [See more](https://docs.orchestrate.pegasys.tech/en/latest/Concepts/Multi-Tenancy/)

Orchestrate uses the OpenID Connect(OIDC) authentication protocol. JSON Web Tokens (JWTs) with custom claims control 
access to tenant resources.

##### Enabling multi-tenancy
To enable multi-tenancy we need to modify the following variables from our local environment file `.env` like so:

```
MULTI_TENANCY_ENABLED=true
AUTH_TOKEN=
```

Then, we need to start Orchestrate again:

```bash
npm run down && npm run up
```

##### Using self-generated certificates

For ease of use in this quickstart, we have provided a dev certificate to encode and decode the generated JWT. 
```
AUTH_JWT_CERTIFICATE=MIIDYjCCAkoCCQC9pJWk7qdipjANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJGUjEOMAwGA1UEBwwFUGFyaXMxEjAQBgNVBAoMCUNvbnNlblN5czEQMA4GA1UECwwHUGVnYVN5czEuMCwGA1UEAwwlZTJlLXRlc3RzLm9yY2hlc3RyYXRlLmNvbnNlbnN5cy5wYXJpczAeFw0xOTEyMjcxNjI5MTdaFw0yMDEyMjYxNjI5MTdaMHMxCzAJBgNVBAYTAkZSMQ4wDAYDVQQHDAVQYXJpczESMBAGA1UECgwJQ29uc2VuU3lzMRAwDgYDVQQLDAdQZWdhU3lzMS4wLAYDVQQDDCVlMmUtdGVzdHMub3JjaGVzdHJhdGUuY29uc2Vuc3lzLnBhcmlzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo0NqWqI3TSi1uOBvCUquclWo4LcsYT21tNUXQ8YyqVYRSsiBv+ZKZBCjD8XklLPih40kFSe+r6DNca5/LH/okQIdc8nsQg+BLCkXeH2NFv+QYtPczAw4YhS6GVxJk3u9sfp8NavWBcQbD3MMDpehMOvhSl0zoP/ZlH6ErKHNtoQgUpPNVQGysNU21KpClmIDD/L1drsbq+rFiDrcVWaOLwGxr8SBd/0b4ngtcwH16RJaxcIXXT5AVia1CNdzmU5/AIg3OfgzvKn5AGrMZBsmGAiCyn4/P3PnuF81/WHukk5ETLnzOH+vC2elSmZ8y80HCGeqOiQ1rs66L936wX8cDwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCNcTs3n/Ps+yIZDH7utxTOaqpDTCB10MzPmb22UAal89couIT6R0fAu14p/LTkxdb2STDySsQY2/Lv6rPdFToHGUI9ZYOTYW1GOWkt1EAao9BzdsoJVwmTON6QnOBKy/9RxlhWP+XSWVsY0te6KYzS7rQyzQoJQeeBNMpUnjiQji9kKi5j9rbVMdjIb4HlmYrcE95ps+oFkyJoA1HLVytAeOjJPXGToNlv3k2UPJzOFUM0ujWWeBTyHMCmZ4RhlrfzDNffY5dlW82USjc5dBlzRyZalXSjhcVhK4asUodomVntrvCShp/8C9LpbQZ+ugFNE8J6neStWrhpRU9/sBJx
AUTH_JWT_PRIVATE_KEY=MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjQ2paojdNKLW44G8JSq5yVajgtyxhPbW01RdDxjKpVhFKyIG/5kpkEKMPxeSUs+KHjSQVJ76voM1xrn8sf+iRAh1zyexCD4EsKRd4fY0W/5Bi09zMDDhiFLoZXEmTe72x+nw1q9YFxBsPcwwOl6Ew6+FKXTOg/9mUfoSsoc22hCBSk81VAbKw1TbUqkKWYgMP8vV2uxur6sWIOtxVZo4vAbGvxIF3/RvieC1zAfXpElrFwhddPkBWJrUI13OZTn8AiDc5+DO8qfkAasxkGyYYCILKfj8/c+e4XzX9Ye6STkRMufM4f68LZ6VKZnzLzQcIZ6o6JDWuzrov3frBfxwPAgMBAAECggEARNLHg7t8SoeNy4i45hbYYRRhI5G0IK3t6nQl4YkslBvXIEpT//xpgbNNufl3OYR3SyMhgdWGWe0Ujga8T5sABBj7J3OIp/R3RJFx9nYewwIq8K5VFqNUJWyNYuF3lreEKQHp2Io+p6GasrGR9JjQ95mIGFwfxo/0Pdfzv/5ZhMWTmSTcOi504Vger5TaPobPFOnULq4y1A4eX4puiHDtvx09DUAWbAjGHpCYZjDGRdSXQArYQmUOKy7R46qKT/ollGOWivnEOgsFmXuUWs/shmcrDG4cGBkRrkxyIZhpnpNEEF5TYgulMMzwM+314e8W0lj9iiSB2nXzt8JhEwTz8QKBgQDSCouFj2lNSJDg+kz70eWBF9SQLrBTZ8JcMte3Q+CjCL1FpSVYYBRzwJNvWFyNNv7kHhYefqfcxUVSUnQ1eZIqTXtm9BsLXnTY+uEkV92spjVmfzBKZvtN3zzip97sfMT9qeyagHEHwpP+KaR0nyffAK+VPhlwNMKgQ9rzP4je+QKBgQDG/JwVaL2b53vi9CNh2XI8KNUd6rx6NGC6YTZ/xKVIgczGKTVex/w1DRWFTb0neUsdus5ITqaxQJtJDw/pOwoIag7Q0ttlLNpYsurx3mgMxpYY12/wurvp1NoU3Dq6ob7igfowP+ahUBchRwt1tlezn3TYxVoZpu9dZHtoynOtRwKBgB9vFJJYdBns0kHZM8w8DWzUdCtf0WOqE5xYv4/dyLCdjjXuETi4qFbqayYuwysfH+Zj2kuWCOkxXL6FOH8IQqeyENXHkoSRDkuqwCcAP1ynQzajskZwQwvUbPg+x039Hj4YQCCfOEtBA4T2Fnadmwn0wFJFiOkR/E6f2RSuXX2BAoGALvVqODsxk9s7B0IqH2tbZAsW0CqXNBesRA+w9tIHV2caViFfcPCs+jAORhkkbG5ZZbix+apl+CqQ+trNHHNMWNP+jxVTpTrChHAktdOQpoMu5MnipuLKedI7bPTT/zsweu/FhSFvYd4utzG26J6Rb9hPkOBx9N/KWTXfUcmFJv0CgYAUYVUvPe7MHSd5m8MulxRnVirWzUIUL9Pf1RKWOUq7Ue4oMxzE8CZCJstunCPWgyyxYXgj480PdIuL92eTR+LyaUESb6szZQTxaJfu0mEJS0KYWlONz+jKM4oC06dgJcCMvhgjta2KpXCm3qL1pmKwfFbOLWYBe5uMoHIn9FdJFQ==
```
> **For production use cases please use your own certificates, which can generated with `openssl`.** Once done please update the variables in the `.env` file.

##### Generate JWT token
To generate a valid JWT we need to run the following command, where `TENANT_ID=` is the tenant id that we include in our token.

```
TENANT_ID=foo npm run generate-jwt
```

By default the _expiration time is 1h_, which can modified to suit your needs by passing in an _EXPIRATION_ environment 
variable at runtime. For example, to make it 5 hours you would execute:
```
EXPIRATION=5h TENANT_ID=foo npm run generate-jwt
```
> **Note:** Decode the generated token using _[https://jwt.io/](https://jwt.io/)_ and verify the correct tenant is included within the selected namespace.

##### Testing the JWT token
Once you have obtained a valid token, please add it to the AUTH_TOKEN=_ value in the `.env` file. Following that, if you 
go through the first [Contracts & Transactions tutorial](#orchestrate-contracts), you should observer that every request 
now gets sent using the generated JWT.

> **Note:**: In some sample cases we need to prefix the token by `Bearer` to be correctly decoded by the Orchestrate services.
