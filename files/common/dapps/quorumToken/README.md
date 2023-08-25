# Using a DApp to interact with the blockchain

This DApp, uses Hardhat and Ethers.js in combination with a self custodial (also called a user controlled) wallet i.e. Metamask to interact with the chain. As such this process esentially comprises two parts:
1. Deploy the contract to the chain 
2. Use the DApp's interface to send and transact on the chain

The `dapps/quorumToken` folder is this structured in this manner (only relevant paths shown):
```
quorumToken
├── hardhat.config.ts       // hardhat network config
├── contracts               // sample contracts of which we use the QuorumToken.sol
├── scripts                 // handy scripts eg: to deploy to a chain
├── test                    // contract tests
└── frontend                // DApp done in next.js 
  ├── README.md
  ├── public
  ├── src
  ├── styles
  ├── tsconfig.json
```

# Contracts
Contracts are written in Solidity and we use the hardhat development environment for testing, deploying etc

The `hardhat.config.js` specifies the networks, accounts, solidity version etc

Install dependencies 
```
npm i
```
Compile the contracts and run tests (optional):
```
yarn hardhat compile
# As you develop contracts you are using the inbuilt `hardhat` network 
npx hardhat test
```

Deploy contracts with:
```
# we specify the network here so the DApp can use the contract, but you can use any network you wish to and remember to connect Metamask to the appropriate network for the DApp
npx hardhat run ./scripts/deploy_quorumtoken.ts --network quickstart
```

*Please remember to save the address returned from the deploy as you will need it for the following steps*

# DApp
We have a sample DApp created that uses Next.js, react and ethers to interact with the quickstart network
```
cd frontend
npm i
npm run dev
```

Open up a tab on port 3001 and connect to Metamask. We recommend you use the test accounts provided as they are seeded with eth you can use on the quickstart network.
When you connect to Metamask, you are presented with a field to input the address of the deployed contract from the previous step. The app will then fetch the contract data and you can then transfer eth to a new annother account. 
