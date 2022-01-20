# Orchestrate Quickstart

Orchestrate enables enterprises to easily build secure and reliable applications on Ethereum blockchains.
It provides advanced features when connected to blockchain networks like:

- Transaction management (transaction crafting, gas management, nonce management, and transaction listening)
- Account management with private key storage in Hashicorp Vault
- Smart contract registry
- Public and private transactions
- Multi-chain.

Orchestrate is a platform developed under the [BSL 1.1](LICENSE) license and written in Go.

For more information, refer to the Codefi Orchestrate official [Documentation](http://docs.orchestrate.consensys.net).

| ⚠️ **Note**: If you have an existing Quorum quickstart running, please stop it before proceeding. The Orchestrate quickstart spins up an Ethereum client which serves as an RPC endpoint. If you have an existing RPC endpoint, please update the `NETWORK_ENDPOINT` in the `.env` file and comment out the eth_client container in the file `<output_folder>/orchestrate/scripts/deps/docker-compose.yml` |
| ---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment setup](#environment-setup)
3. [Tutorial](#tutorial)
   1. [Chains](#orchestrate-chains)
   2. [Accounts](#orchestrate-accounts)
   3. [Contracts & Transactions](#orchestrate-contracts)
   4. [Private transactions](#orchestrate-priv-transactions)
   5. [Signing](#orchestrate-signing)
   6. [Multitenancy](#orchestrate-multitenancy)

## Prerequisites

To run these tutorials, you must have the following installed:

- [Docker and Docker-compose](https://docs.docker.com/compose/install/)

| ⚠️ **Note**: If on MacOS or Windows, please ensure that you allow docker to use upto 4G of memory or 6G if running Privacy examples under the _Resources_ section. The [Docker for Mac](https://docs.docker.com/docker-for-mac/) and [Docker Desktop](https://docs.docker.com/docker-for-windows/) sites have details on how to do this at the "Resources" heading |
| ---

| ⚠️ **Note**: This has only been tested on Windows 10 Build 18362 and Docker >= 17.12.2
| ---

- On Windows ensure that the drive, that this repo is cloned onto, is a "Shared Drive" with Docker Desktop
- On Windows we recommend running all commands from GitBash
- [Nodejs](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)

## Environment setup

**Install the Orchestrate CLI**

```
$> npm install
```

See Orchestrate CLI help:

```
$> npm run orchestrate -- help
```

**To start services and the dependencies:**

```
$> npm run up
```

**To stop environment**

```
$> npm run down
```

## Tutorial

This tutorial will show you how to connect Orchestrate to a blockchain network and use the Contract Registry to deploy
smart contracts, send transactions etc.

### a. Register chains <a name="orchestrate-chains"></a>

##### Connect to the blockchain network

Now that you have Orchestrate up and running and an account created, it's time to connect Orchestrate to a blockchain
network, by using the REST APIs

```
$> npm run register-chain
...
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
$> npm run get-latest-block
```

and the response should be details about the latest mined block on your chain

### b. Account management <a name="orchestrate-accounts"></a>

##### Create an Ethereum account that serves as your **Network Faucet**

```
$> npm run generate-account
...
{
  uuid: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
  address: '0x90494000f242D9e41Cd635939536Aa7aA869CfCF',
  ...
}
```

(please note the account value will be different in your case)

Copy the output of this command and add it to the `.env` file as the value for the `FAUCET_ACCOUNT` variable, like so:
`FAUCET_ACCOUNT=0x90494000f242D9e41Cd635939536Aa7aA869CfCF`

##### List accounts stored in Hashicorp Vault

The faucet account's private key is stored in Hashicorp Vault and it's Ethereum address can be obtained by

```
$> npm run get-accounts
...
[
  {
    uuid: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
    ...
  }
]
```

(please note the key value will be different in your case)

##### Configure a [Faucet](https://docs.orchestrate.pegasys.tech)

Note: On paid gas networks (for example, public networks such as Ethereum mainnet or Rinkeby and also some private networks,
such as the Ethereum one used in this quickstart), an Ethereum account must have a positive ETH balance to pay transactions
fees for mining. Orchestrate provides a faucet to automatically provide the required ETH to accounts managed by Orchestrate

A faucet is defined using a name, a creditor account used to credit other accounts, and a chain identified by its UUID.

The following command uses the CHAIN, CHAIN_UUID and FAUCET_ACCOUNT values from the .env file to create a faucet.
Here the faucet is named using the chain name suffixed by -faucet.

```
$> npm run create-faucet
...
{
  uuid: '47afcb8c-e8bf-4275-a21d-ae29968e10d8',
  name: 'dev-faucet',
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

![Image metamask_faucet](./network/static/metamask-faucet-transfer.png)

### c. Deploy contracts and send transactions <a name="orchestrate-contracts"></a>

##### Register the smart contract

Orchestrate provides a contract registry which you can use to deploy contracts on your registered networks. But first
you have to create, compile, and add your contract to the registry.

So, first we compile the contracts

```
$> npm run compile
...
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
$> npm run register-contract
...
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
  bytecode: '0x60806040...',
  deployedBytecode: '0x6080604052348015600f57...'
}

```

To query the Contract Registry for a list of Smart Contracts:

```
$> npm run get-catalog
...
[ 'Counter' ]
```

##### Create an account to send transactions

Generate an account to be used for sending transactions to the smart contact. The generated account is stored by the
Hashicorp Vault service.

```
$> npm run generate-account
...
{
  uuid: '35e2a951-1f9f-4ad0-9d14-199f5b330dc2',
  address: '0xF0156f5949e4667E5396D41ff22616EDc21f0150',
  ...
}
```

Note: The generated account is automatically funded by the faucet service configured previously. Copy the account address
and set the `FROM_ACCOUNT` value with this address in `.env` file, like so: `FROM_ACCOUNT=0xF0156f5949e4667E5396D41ff22616EDc21f0150`

##### Deploy the contract and send contract transactions

Orchestrate manages blockchain transactions that are asynchronous by nature due to blockchain mining time. Orchestrate
provides an event consumer to process transaction receipts when they are generated, and uses Apache Kafka to handle these
asynchronous communications.

In the next steps, we send two kinds of transactions:

- Create the contract on the chain
- Interact with the contract by send a transaction to it

You have to run a consumer script to listen to the transaction receipt events and see them happen on the network. In your
current terminal, start the consumer and let the consumer run in the foreground:

```
$> npm run consume
```

In another terminal session, deploy the smart contract

```
$> npm run deploy
...
Transaction request sent successfully {
  uuid: 'b98f148c-0c83-4e8f-9d75-8ac3aabb3355',
  idempotencyKey: '699833c9-e9d3-4d69-8590-4467ccea5a28',
  params: {
    from: '0xF0156f5949e4667E5396D41ff22616EDc21f0150',
    contractName: 'Counter',
    contractTag: 'latest'
  },
  jobs: [ [Object] ],
  createdAt: '2020-08-10T00:26:33.311468Z'
}

```

After a few seconds (depending on block time), you see the receipt related to the contract creation transaction in the consumer terminal.

```
Message received ! {
  envelopeId: 'b98f148c-0c83-4e8f-9d75-8ac3aabb3355',
  offset: '1',
  topic: 'topic-tx-decoded',
  chain: 'dev'
}
RequestId: b98f148c-0c83-4e8f-9d75-8ac3aabb3355
Receipt: {
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 312,
  "txIndex": 0,
  "txHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "status": true,
  "contractAddress": "0xA94F5374fCE5EDBC8E2A8697C15331677D6EBF0B",
  "cumulativeGasUsed": 125733,
  "gasUsed": 125733,
  "postState": undefined,
  "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "revertReason": undefined,
  "output": undefined,
  "privateFrom": undefined,
  "privateFor": [],
  "privacyGroupId": undefined
}
```

Copy the contractAddress in the receipt and set the TO_ACCOUNT value with this address in .env file, like so:
`TO_ACCOUNT=0xA94F5374fCE5EDBC8E2A8697C15331677D6EBF0B`

##### Send a Transaction to the Smart Contract

> **Important:** Before moving forward, ensure the FROM_ACCOUNT and TO_ACCOUNT are set in the .env file.

On the second terminal, send the transaction:

```
> npm run send-tx
...

Transaction request sent successfully {
  uuid: '12431cba-5719-4a69-912d-d8713bc4a8ad',
  idempotencyKey: '792de89e-226e-4fe2-bad8-511a997d9bbd',
  chain: 'dev',
  params: {
    from: '0xF0156f5949e4667E5396D41ff22616EDc21f0150',
    to: '0xA94F5374fCE5EDBC8E2A8697C15331677D6EBF0B',
    methodSignature: 'increment(uint256)',
    args: [ 1 ]
  },
  schedule: {
    uuid: '188b8aa9-4343-4772-b390-7021dee7d82b',
    tenantID: '_',
    jobs: [ [Object] ],
    createdAt: '2020-08-11T00:11:56.743088Z'
  },
  createdAt: '2020-08-11T00:11:
```

After a few seconds you will see the transaction request id, and the transaction receipt in the consumer output on the
first terminal as before

This concludes the first tutorial on how to deploy contracts and send transactions.

### d. Send private transactions <a name="orchestrate-priv-transactions"></a>

PegaSys Orchestrate is compatible with **Quorum Tessera** for private transactions. Private transactions are only available within participants of the consortium.

<!-- In order to be able to follow next part of the tutorial you have to setup your selected network: -->
<!-- ``` -->
<!-- $> cd ./network/ -->
<!-- ``` -->

<!-- Then following instructions: -->
<!-- - [Hyperledger Besu](../besu/README.md) -->
<!-- - [GoQuorum](../goquorum/README.md) -->

#### EEA Private Transaction (only available for Besu network with privacy enabled)

To send a private transaction in Besu, run:

```bash
$> npm run send-eea-private-tx
```

After a few seconds (depending on block time), you see the transaction private receipt in the consumer
output on the first terminal.

> For more information about EEA private transactions, refer to the [Besu privacy documentation](https://besu.hyperledger.org/en/stable/Concepts/Privacy/Private-Transactions/).

#### Go-Quorum Tessera (only available for go-quorum network with privacy enabled)

To send a private transaction in Go-Quorum, run:

```bash
$> npm run send-tessera-private-tx
```

After a few seconds (depending on block time), you see the transaction private receipt in the consumer
output on the first terminal.

> For more information about tessera private transactions, refer to the [Quorum privacy documentation](https://goquorum.readthedocs.io/en/stable/Privacy/Tessera/Tessera/).

### e. Signing <a name="orchestrate-singing"></a>

Using Orchestrate and accounts store in the key vault you can sign messages and/or typed data. In addition verifying whether
or not a signature corresponds to a certain sender.

To sign data defined in our `.env` file `DATA_TO_SIGN=....` using EIP-191 standard we run :

```
$> npm run sign-message
...
0x6eddbe4e12d435b79128dd51556a820b52e93cdb308dec5191818f9839f519c955b9aac8a4af5046f651ad9a0da5dc36171568a65696966baf8c916539c1003d1b
```

Taking previous replace `[SIGNATURE]` in `.env` file before running next command;

```
$> npm run verify-signature
...
Signature was verified successfully
```

#### Sign typed data

At last if you want to sign typed data:

```
$> npm run sign-typed-data
...
0x8ff93e4724254373d6a1f7066e2cb39210c220b1e0d38cc44b3766e87be59b1d4dd3c530e48a83592da57e07b3e195f7543fe153feaee5c7c22f47dd2026283b01
```

### f. Multitenancy <a name="orchestrate-multitenancy"></a>

Multi-tenancy enables serving multiple blockchain applications with a single Orchestrate instance. Resources including
transaction streams, access to the blockchain network, private keys, and smart contracts are isolated to the tenant that
owns them. [See more](https://docs.orchestrate.pegasys.tech/en/stable/Concepts/Multi-Tenancy/)

Orchestrate uses the OpenID Connect(OIDC) authentication protocol. JSON Web Tokens (JWTs) with custom claims control
access to tenant resources.

##### Enabling multi-tenancy

To enable multi-tenancy we need to modify the following variables from our local environment file `.env` as it is described
in the [documentation](https://docs.orchestrate.pegasys.tech/en/latest/Howto/Configure/MultiTenancy/)

##### Testing the JWT token

Once you have obtained a valid token, please replace it to the `[TENANT_AUTH_TOKEN]` value in the `.env` file. Following that, if you
go through the first [Contracts & Transactions tutorial](#orchestrate-contracts), you should observer that every request
now gets sent using the generated JWT.

> **Note:**: In some sample cases we need to prefix the token by `Bearer` to be correctly decoded by the Orchestrate services.
