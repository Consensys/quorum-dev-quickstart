const path = require('path');
const fs = require('fs-extra');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');

// member1 details
const { tessera, besu } = require("./keys.js");
const host = besu.ethsignerProxy.url;

async function main(){
  const web3 = new Web3(host);
  // preseeded account with 90000 ETH
  const privateKeyA = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
  const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
  var accountABalance = web3.utils.fromWei(await web3.eth.getBalance(accountA.address));
  console.log("Account A has balance of: " + accountABalance);

  // create a new account to use to transfer eth to
  var accountB = web3.eth.accounts.create();
  var accountBBalance = web3.utils.fromWei(await web3.eth.getBalance(accountB.address));
  console.log("Account B has balance of: " + accountBBalance);

  // send some eth from A to B
  const rawTxOptions = {
    nonce: web3.utils.numberToHex(await web3.eth.getTransactionCount(accountA.address)),
    from: accountA.address,
    to: accountB.address, 
    value: "0x100",  //amount of eth to transfer
    gasPrice: "0x0", //ETH per unit of gas
    gasLimit: "0x24A22" //max number of gas units the tx is allowed to use
  };
  console.log("Creating transaction...");
  const tx = new Tx(rawTxOptions);
  console.log("Signing transaction...");
  tx.sign(Buffer.from(accountA.privateKey.substring(2), "hex"));
  console.log("Sending transaction...");
  var serializedTx = tx.serialize();
  const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
  console.log("tx transactionHash: " + pTx.transactionHash);

  //After the transaction there should be some ETH transferred
  accountABalance = web3.utils.fromWei(await web3.eth.getBalance(accountA.address));
  console.log("Account A has an updated balance of: " + accountABalance);
  accountBBalance = web3.utils.fromWei(await web3.eth.getBalance(accountB.address));
  console.log("Account B has an updatedbalance of: " + accountBBalance);

}

if (require.main === module) {
  main();
}

module.exports = exports = main

