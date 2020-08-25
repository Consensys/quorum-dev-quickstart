const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const EEAClient = require('web3-eea');
const { orion, besu } = require("./keys.js");

const chainId = 2018;
const web3 = new EEAClient(new Web3(besu.member1.url), chainId);

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const constractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
const constractJson = JSON.parse(fs.readFileSync(constractJsonPath));
const abi = constractJson.abi;
const bytecode = constractJson.evm.bytecode.object
var deployedTxHash = "";
var deployedContractAddress = "";

//deploying a contract with sendRawTransaction
const createContract = () => {
  const contractOptions = {
    data: '0x'+bytecode,
    privateFrom: orion.member1.publicKey,
    privateFor: [orion.member3.publicKey],
    privateKey: besu.member1.privateKey
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

//get address of contract
const getContractAddress = (transactionHash) => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv.getTransactionReceipt(transactionHash, orion.member1.publicKey)
                  .then(privateTransactionReceipt => {
                    console.log("Private Transaction Receipt\n", privateTransactionReceipt);
                    return privateTransactionReceipt.contractAddress;
                  });
};

const sendFromOneToThree = (address, value) => {
  const contract = new web3.eth.Contract(abi);

  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "set";
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
      console.log("Event Emitted: ");
      console.log(result);
      return result;
    });
};


const getValueAtAddressOnNode = (url, address, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), chainId);
  const contract = new web3.eth.Contract(abi);

  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find(e => {
    return e.name === "get";
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
      console.log(`Get Value from ${url}:`, result.output);
      return result;
    });
};


module.exports = () => {
  return createContract()
    .then(getContractAddress)
    .then(address => {
        deployedContractAddress = address;
        sendFromOneToThree(deployedContractAddress, 47)
    })
    .then(() => {
        return getValueAtAddressOnNode(besu.member1.url, deployedContractAddress, orion.member1.publicKey, [orion.member3.publicKey], besu.member1.privateKey);
    })
    .then(() => {
        return getValueAtAddressOnNode(besu.member2.url, deployedContractAddress, orion.member2.publicKey, [orion.member1.publicKey], besu.member2.privateKey);
    })
    .then(() => {
        return getValueAtAddressOnNode(besu.member3.url, deployedContractAddress, orion.member3.publicKey, [orion.member1.publicKey], besu.member3.privateKey);
    })
    .catch(console.error);
};

if (require.main === module) {
  module.exports();
}


