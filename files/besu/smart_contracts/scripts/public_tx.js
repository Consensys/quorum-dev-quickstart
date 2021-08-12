const path = require('path');
const fs = require('fs-extra');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');

// member1 details
const { tessera, besu } = require("./keys.js");
const host = besu.ethsignerProxy.url;
const accountAddress = besu.ethsignerProxy.accountAddress;

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBinPath = path.resolve(__dirname, '../','contracts','SimpleStorage.bin');
const contractBin = fs.readFileSync(contractBinPath);
// initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
const contractConstructorInit = "000000000000000000000000000000000000000000000000000000000000002F";

async function getValueAtAddress(host, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call();
  console.log("Obtained value at deployed contract is: "+ res);
  return res
}

// You need to use the accountAddress details provided to Quorum to send/interact with contracts
async function setValueAtAddress(host, accountAddress, value, deployedContractAbi, deployedContractAddress){
  const web3 = new Web3(host);
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: accountAddress, gasPrice: "0x0", gasLimit: "0x24A22"});
  // verify the updated value
  // const readRes = await contractInstance.methods.get().call();
  // console.log("Obtained value at deployed contract is: "+ readRes);
  return res
}

async function createContract(host, contractBin, contractInit) {
  const web3 = new Web3(host);
  // make an account and sign the transaction with the account's private key; you can alternatively use an exsiting account
  const account = web3.eth.accounts.create();
  console.log(account);

  const rawTxOptions = {
    nonce: "0x00",
    from: account.address,
    to: null, //public tx
    value: "0x00",
    data: '0x'+contractBin+contractInit,
    gasPrice: "0x0", //ETH per unit of gas
    gasLimit: "0x24A22" //max number of gas units the tx is allowed to use
  };
  console.log("Creating transaction...");
  const tx = new Tx(rawTxOptions);
  console.log("Signing transaction...");
  tx.sign(Buffer.from(account.privateKey.substring(2), "hex"));
  console.log("Sending transaction...");
  var serializedTx = tx.serialize();
  const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
  console.log("tx transactionHash: " + pTx.transactionHash);
  console.log("tx contractAddress: " + pTx.contractAddress);
  return pTx;
};

async function main(){
  let newValue = 123;
  createContract(host, contractBin, contractConstructorInit)
  .then(async function(tx){
    console.log("Contract deployed at address: " + tx.contractAddress);
    console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
    await getValueAtAddress(host, contractAbi, tx.contractAddress);
    console.log(`Use the smart contracts 'set' function to update that value to ${newValue} ...` );
    await setValueAtAddress(host, accountAddress, newValue, contractAbi, tx.contractAddress );
    console.log("Verify the updated value that was set .. " )
    await getValueAtAddress(host, contractAbi, tx.contractAddress);
  })
  .catch(console.error);
}

if (require.main === module) {
  main();
}

module.exports = exports = main

