const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const Web3Quorum = require('web3js-quorum');

// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys
const { tessera, quorum } = require("./keys.js");
const chainId = 1337;
// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractBytecode = contractJson.evm.bytecode.object
const contractAbi = contractJson.abi;

// initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
const contractConstructorInit = "000000000000000000000000000000000000000000000000000000000000002F";

// Besu doesn't support eth_sendTransaction so we use the eea_sendRawTransaction for things like simple value transfers, contract creation or contract invocation
async function createContract(client, fromPrivateKey, fromPublicKey, toPublicKey) {
  const web3 = new Web3(client.url)
  // web3Quorum in quorum mode (web3 client, enclave options, isQuorum)
  // https://consensys.github.io/web3js-quorum/latest/Web3Quorum.html
  const web3quorum = new Web3Quorum(web3, {privateUrl: client.privateUrl}, true);

  // unlock the account so you can sign the tx; uses web3.eth.accounts.decrypt(keystoreJsonV3, password);
  const accountKeyPath = path.resolve(__dirname, '../../','config/nodes', client.name ,'accountKeystore');
  const accountKey = JSON.parse(fs.readFileSync(accountKeyPath));
  const signingAccount = web3.eth.accounts.decrypt(accountKey, "");

  // get the nonce for the accountAddress
  const accountAddress = client.accountAddress;
  const txCount = await web3.eth.getTransactionCount(`0x${accountAddress}`);

  const txOptions = {
    chainId,
    nonce: txCount,
    gasPrice: 0, //ETH per unit of gas
    gasLimit: 0x24A22, //max number of gas units the tx is allowed to use
    value: 0,
    data: '0x'+contractBytecode+contractConstructorInit,
    from: signingAccount,
    isPrivate: true,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey]
  };
  console.log("Creating contract...");
  // Generate and send the Raw transaction to the Besu node using the eea_sendRawTransaction JSON-RPC call
  const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
  console.log("Getting contractAddress from txHash: ", txHash);
  return txHash
};

async function getValueAtAddress(client, nodeName="node", deployedContractAddress, contractAbi) {
  const web3 = new Web3(client.url)
  const web3quorum = new Web3Quorum(web3, {privateUrl: client.privateUrl}, true);
  const contractInstance = new web3quorum.eth.Contract(contractAbi, deployedContractAddress);
  const res = await contractInstance.methods.get().call().catch(() => {});
  console.log(nodeName + " obtained value at deployed contract is: "+ res);
  return res;
};

async function setValueAtAddress(client, deployedContractAddress, value, contractAbi, fromPrivateKey, fromPublicKey, toPublicKey) {
  const web3 = new Web3(client.url)
  const web3quorum = new Web3Quorum(web3, {privateUrl: client.privateUrl}, true);
  const contractInstance = new web3quorum.eth.Contract(contractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: client.accountAddress, privateFor: [toPublicKey], gasLimit: "0x24A22"});
  return res;
};

async function main(){

  createContract(quorum.member1, quorum.member1.privateKey, tessera.member1.publicKey, tessera.member3.publicKey)
  .then( async function(privateTxReceipt){
    console.log("Address of transaction: ", privateTxReceipt.contractAddress);
    let newValue = 123;

    //wait for the blocks to propogate to the other nodes
    await new Promise(r => setTimeout(r, 10000));
    console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
    await getValueAtAddress(quorum.member1, "Member1",  privateTxReceipt.contractAddress, contractAbi);

    console.log(`Use the smart contracts 'set' function to update that value to ${newValue} .. - from member1 to member3`);
    await setValueAtAddress(quorum.member1, privateTxReceipt.contractAddress, newValue, contractAbi, quorum.member1.privateKey, tessera.member1.publicKey, tessera.member3.publicKey);

    //wait for the blocks to propogate to the other nodes
    await new Promise(r => setTimeout(r, 20000));
    console.log("Verify the private transaction is private by reading the value from all three members .. " )
    await getValueAtAddress(quorum.member1, "Member1",  privateTxReceipt.contractAddress, contractAbi);
    await getValueAtAddress(quorum.member2, "Member2",  privateTxReceipt.contractAddress, contractAbi);
    await getValueAtAddress(quorum.member3, "Member3",  privateTxReceipt.contractAddress, contractAbi);

  })
 .catch(console.error);

}

if (require.main === module) {
  main();
}

module.exports = exports = main
