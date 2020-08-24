const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');

const member1AccountAddress = "0xf0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5"
const member3TMPubKey = "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="

const member1 = new Web3(new Web3.providers.HttpProvider("http://localhost:20000"));
const member2 = new Web3(new Web3.providers.HttpProvider("http://localhost:20002"));
const member3 = new Web3(new Web3.providers.HttpProvider("http://localhost:20004"));
member1.eth.defaultAccount = member1AccountAddress;

function getValueAtAddressOnNode(web3Client, nodeName="node", abi, deployedContractAddress){
  var contractInstance = new web3Client.eth.Contract(abi, deployedContractAddress);
  contractInstance.methods.get().call(function(err,res){
    if(!err){
       console.log(nodeName + " value of deployed contract is: "+ res);
    } else {
       console.error(nodeName + " cannot find any value here.");
       //console.error(err);
    }
  });
}

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const constractJsonPath = path.resolve(__dirname, '../','contracts','simplestorage.json');
const constractJson = JSON.parse(fs.readFileSync(constractJsonPath));
const abi = constractJson.abi;
const bytecode = constractJson.evm.bytecode.object
var deployedTxHash = "";
var deployedContractAddress = "";

// send the contract with the value of 47
var contractInstance = new member1.eth.Contract(abi);
const contractOptions = {
  data: '0x'+bytecode,
  arguments: [47],
  privateFor: [member3TMPubKey]
};
contractInstance.deploy(contractOptions)
.send({
  from: member1AccountAddress,
  gas: 0x47b760,
  privateFor: [member3TMPubKey]
}, function(error, transactionHash){
    deployedTxHash = transactionHash;
    console.log("error= " + error + "; transactionHash=" + deployedTxHash);
})
  .on('error', function(error){
      console.error(error); })
  .on('transactionHash', function(transactionHash){
      console.log("Contract transaction send: TransactionHash: " + transactionHash + " waiting to be mined..."); })
  .on('receipt', function(receipt){
      console.log("receipt: " + receipt.contractAddress) // contains the new contract address
  })
  .on('confirmation', function(confirmationNumber, receipt){
      console.log("confirmation: " + confirmationNumber) // contains the new contract address
  })
  .then(function(newContractInstance){
      deployedContractAddress = newContractInstance.options.address;
      console.log("newContractInstance address: " + deployedContractAddress) // instance with the new contract address

      console.log("Checking each member to verify that the contract has been deployed between members 1 & 3 only...")
      //read the value of the contract at the address deployed
      getValueAtAddressOnNode(member1, "member1", abi, deployedContractAddress);
      getValueAtAddressOnNode(member2, "member2", abi, deployedContractAddress);
      getValueAtAddressOnNode(member3, "member3", abi, deployedContractAddress);
  });


// check the transaction hash
// if the data value has a 0x25 or 0x26; it indicates that the transaction has a private payload
//member1.eth.getTransaction(deployedTxHash)
//.then(res => { console.log(res);})
//.catch(err => console.log(err));



