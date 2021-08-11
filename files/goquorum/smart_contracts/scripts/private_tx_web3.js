const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');

// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys
const { tessera, quorum } = require("./keys.js");

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractByteCode = contractJson.evm.bytecode.object
const contractAbi = contractJson.abi;

async function getValueAtAddress(host, nodeName="node", deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call().catch(() => {});
  console.log(nodeName + " obtained value at deployed contract is: "+ res);
  return res
}

// You need to use the accountAddress details provided to Quorum to send/interact with contracts
async function setValueAtAddress(host, value, deployedContractAbi, deployedContractAddress, fromAddress, toPublicKey) {
  const web3 = new Web3(host)
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22"});
  // verify the updated value
  // const readRes = await contractInstance.methods.get().call();
  // console.log("Obtained value at deployed contract is: "+ readRes);
  return res
}

async function createContract(host, contractAbi, contractByteCode, contractInit, fromAddress, toPublicKey) {
  const web3 = new Web3(host)
  const contractInstance = new web3.eth.Contract(contractAbi);
  const ci = await contractInstance
    .deploy({ data: '0x'+contractByteCode, arguments: [contractInit] })
    .send({ from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22" })
    .on('transactionHash', function(hash){
      console.log("The transaction hash is: " + hash);
    });
  return ci;
};

async function main(){
  createContract(quorum.member1.url, contractAbi, contractByteCode, 47, quorum.member1.accountAddress, tessera.member3.publicKey)
  .then(async function(ci){
    console.log("Address of transaction: ", ci.options.address);

    //wait for the blocks to propogate to the other nodes
    await new Promise(r => setTimeout(r, 10000));
    console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
    await getValueAtAddress(quorum.member1.url, "Member1", contractAbi, ci.options.address);
    console.log("Use the smart contracts 'set' function to update that value to 123 .. - from member1 to member3 " );
    await setValueAtAddress(quorum.member1.url, 123, contractAbi, ci.options.address, quorum.member1.accountAddress, tessera.member3.publicKey);
    //wait for the blocks to propogate to the other nodes
    await new Promise(r => setTimeout(r, 10000));

    console.log("Verify the private transaction is private by reading the value from all three members .. " )
    await getValueAtAddress(quorum.member1.url, "Member1", contractAbi, ci.options.address);
    await getValueAtAddress(quorum.member3.url, "Member3", contractAbi, ci.options.address);
    await getValueAtAddress(quorum.member2.url, "Member2", contractAbi, ci.options.address);

  })
 .catch(console.error);

}

if (require.main === module) {
  main();
}

module.exports = exports = main



