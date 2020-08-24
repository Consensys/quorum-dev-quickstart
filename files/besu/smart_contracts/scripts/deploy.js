const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const EEAClient = require('web3-eea');

const member1PrivateKey = "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"
const member1OrionPubKey = "A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo="
const member3OrionPubKey = "k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8="

const web3 = new EEAClient(new Web3("http://localhost:20000"), 2018);

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const constractJsonPath = path.resolve(__dirname, '../','contracts','simplestorage.json');
const constractJson = JSON.parse(fs.readFileSync(constractJsonPath));
const abi = constractJson.abi;
const bytecode = constractJson.evm.bytecode.object
var deployedTxHash = "";
var deployedContractAddress = "";

//deploying a contract with sendRawTransaction
const createContract = () => {
  const contractOptions = {
    data: '0x'+bytecode,
    privateFrom: member1OrionPubKey,
    privateFor: [member3OrionPubKey],
    privateKey: member1PrivateKey
  };
  return web3.eea.sendRawTransaction(contractOptions);
};

//get address of contract
const getContractAddress = (transactionHash) => {
  console.log("Transaction Hash ", transactionHash);
  return web3.priv.getTransactionReceipt(transactionHash, member1OrionPubKey)
                  .then(privateTransactionReceipt => {
                    console.log("Private Transaction Receipt\n", privateTransactionReceipt);
                    return privateTransactionReceipt.contractAddress;
                  });
};

const sendFromOneToThree = (address, value) => {
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
    privateFrom: member1OrionPubKey,
    privateFor: [member3OrionPubKey],
    privateKey: member1PrivateKey
  };
  return web3.eea.sendRawTransaction(functionCall)
    .then(transactionHash => {
      console.log("Transaction Hash:", transactionHash);
      return web3.priv.getTransactionReceipt(transactionHash, member1OrionPubKey);
    })
    .then(result => {
      console.log("Event Emitted:", result.logs[0].data);
      return result;
    });
};


const getValueAtAddressOnNode = (url, address, privateFrom, privateFor, privateKey) => {
  const web3 = new EEAClient(new Web3(url), 2018);
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
      return web3.priv.getTransactionReceipt(transactionHash, member1OrionPubKey);
    })
    .then(result => {
      console.log(`Get Value from ${url}:`, result.output);
      return result;
    });
};


module.exports = () => {
  return createContract()
    .then(getPrivateContractAddress)
    .then(address => {
        sendFromOneToThree(address, 47)
    })
    .then(() => {
        return getValueAtAddressOnNode("http://localhost:20000", address, member1OrionPubKey, member3OrionPubKey, member1PrivateKey);
    })
    .then(() => {
        return getValueAtAddressOnNode(("http://localhost:20002", address, member1OrionPubKey, member2OrionPubKey, member1PrivateKey);
    })
    .then(() => {
        return getValueAtAddressOnNode(("http://localhost:20000", address, member3OrionPubKey, member1OrionPubKey, member1PrivateKey);
    })
    .catch(console.error);
};

if (require.main === module) {
  module.exports();
}


