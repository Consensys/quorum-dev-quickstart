const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const EEAClient = require('web3-eea');

// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys
const { orion, besu } = require("./keys.js");

const chainId = 2018;
const web3 = new EEAClient(new Web3(besu.member1.url), chainId);

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const constractJsonPath = path.resolve(__dirname, '../','contracts','EventEmitter.json');
const constractJson = JSON.parse(fs.readFileSync(constractJsonPath));
const abi = constractJson.abi;
const bytecode = constractJson.evm.bytecode.object
var deployedTxHash = "";
var deployedContractAddress = "";

//deploying a contract with sendRawTransaction
function createContract() {
  const contractOptions = {
    data: '0x'+bytecode,
    privateFrom: orion.member1.publicKey,
    privateFor: [orion.member3.publicKey],
    privateKey: besu.member1.privateKey
  };
  console.log("Creating contract...");
  return web3.eea.sendRawTransaction(contractOptions);
};

//get address of contract
function getContractAddress(transactionHash) {
  console.log("Getting contractAddress from txHash: ", transactionHash);
  return web3.priv.getTransactionReceipt(transactionHash, orion.member1.publicKey)
                  .then(privateTransactionReceipt => {
                    //console.log("Private Transaction Receipt\n", privateTransactionReceipt);
                    return privateTransactionReceipt.contractAddress;
                  });
};

function sendFromOneToThree(address, value) {
  const contract = new web3.eth.Contract(abi);

  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "store";
  });
  const functionArgs = web3.eth.abi
    .encodeParameters(functionAbi.inputs, [value])
    .slice(2);

  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateFrom: orion.member1.publicKey,
    privateFor: [orion.member3.publicKey],
    privateKey: besu.member1.privateKey
  };
  return web3.eea.sendRawTransaction(functionParams)
    .then(transactionHash => {
      console.log("Transaction Hash:", transactionHash);
      return web3.priv.getTransactionReceipt(transactionHash, orion.member1.publicKey);
    })
    .then(result => {
      //console.log("Event Emitted: ");
      //console.log(result);
      return result;
    });
};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getValueAtAddressOnNode(url, nodeName="node", address, privateFrom, privateFor, privateKey) {
  const web3 = new EEAClient(new Web3(url), chainId);
  const contract = new web3.eth.Contract(abi);

  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "value";
  });
  const functionCall = {
    to: address,
    data: functionAbi.signature,
    privateFrom,
    privateFor,
    privateKey
  };

  return web3.eea.sendRawTransaction(functionCall)
    .then(transactionHash => {
      console.log("Transaction Hash:", transactionHash);
      return web3.priv.getTransactionReceipt(transactionHash, orion.member1.publicKey);
    })
    .then(result => {
      console.log("" + nodeName + " value from deployed contract is: " + result.output);
      return result;
    });
};


module.exports = () => {
  createContract()
  .then(getContractAddress)
  .then(address => {
    deployedContractAddress = address;
    console.log("Contract deployed at address: "+ deployedContractAddress);
    sendFromOneToThree(deployedContractAddress, 47)
  })
  .catch(console.error);

  //wait for the blocks to propogate to the other nodes
  sleep(20000).then(() => {
    getValueAtAddressOnNode(besu.member1.url, "Member1", deployedContractAddress, orion.member1.publicKey, [orion.member3.publicKey], besu.member1.privateKey);
    getValueAtAddressOnNode(besu.member2.url, "Member2", deployedContractAddress, orion.member2.publicKey, [orion.member1.publicKey], besu.member2.privateKey);
    getValueAtAddressOnNode(besu.member3.url, "Member3", deployedContractAddress, orion.member3.publicKey, [orion.member1.publicKey], besu.member3.privateKey);
  });
};

if (require.main === module) {
  module.exports();
}


