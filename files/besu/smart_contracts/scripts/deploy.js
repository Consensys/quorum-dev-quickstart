const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const EEAClient = require('web3-eea');

// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys
const { tessera, besu } = require("./keys.js");
const chainId = 1337;
const web3 = new EEAClient(new Web3(besu.member1.url), chainId);

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const constractJsonPath = path.resolve(__dirname, '../','contracts','EventEmitter.json');
const constractJson = JSON.parse(fs.readFileSync(constractJsonPath));
const abi = constractJson.abi;
const bytecode = constractJson.evm.bytecode.object
var deployedContractAddress = "";

//deploying a contract with sendRawTransaction
async function createContract() {
  const contractOptions = {
    data: '0x'+bytecode,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member3.publicKey],
    privateKey: besu.member1.privateKey
  };
  console.log("Creating contract...");
  const c = await web3.eea.sendRawTransaction(contractOptions);
  return c;
};

//get address of contract
async function getContractAddress(transactionHash) {
  console.log("Getting contractAddress from txHash: ", transactionHash);
  const privateTransactionReceipt = await web3.priv.getTransactionReceipt(transactionHash, tessera.member1.publicKey);
  console.log(`Private Transaction Receipt: ${privateTransactionReceipt}`);
  return privateTransactionReceipt.contractAddress;
};

async function sendFromOneToThree(address, value) {
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
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member3.publicKey],
    privateKey: besu.member1.privateKey
  };
  const transactionHash = await web3.eea.sendRawTransaction(functionParams);
  console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3.priv.getTransactionReceipt(transactionHash, tessera.member1.publicKey);
  return result;
};

async function getValueAtAddressOnNode(url, nodeName="node", address, privateFrom, privateFor, privateKey) {
  const web3 = new EEAClient(new Web3(url), chainId);
  const contract = new web3.eth.Contract(abi);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "value";
  });
  const functionParams = {
    to: address,
    data: functionAbi.signature,
    privateFrom,
    privateFor,
    privateKey
  };
  const transactionHash = await web3.eea.sendRawTransaction(functionParams);
  console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3.priv.getTransactionReceipt(transactionHash, tessera.member1.publicKey);
  console.log("" + nodeName + " value from deployed contract is: " + result.output);
  return result;
};

async function main(){
  createContract()
  .then(getContractAddress)
  .then(address => {
    deployedContractAddress = address;
    console.log("Contract deployed at address: "+ deployedContractAddress);
    sendFromOneToThree(deployedContractAddress, 47)
  })
  .catch(console.error);

  //wait for the blocks to propogate to the other nodes
  await new Promise(r => setTimeout(r, 20000));
  getValueAtAddressOnNode(besu.member1.url, "Member1", deployedContractAddress, tessera.member1.publicKey, [tessera.member3.publicKey], besu.member1.privateKey);
  getValueAtAddressOnNode(besu.member2.url, "Member2", deployedContractAddress, tessera.member2.publicKey, [tessera.member1.publicKey], besu.member2.privateKey);
  getValueAtAddressOnNode(besu.member3.url, "Member3", deployedContractAddress, tessera.member3.publicKey, [tessera.member1.publicKey], besu.member3.privateKey);

}

if (require.main === module) {
  main();
}

module.exports = exports = main



