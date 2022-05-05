const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');

// member1 details
const { quorum } = require("./keys.js");
const host = quorum.member1.url;
const accountAddress = quorum.member1.accountAddress;

// ac = eth.accounts[0];
// web3.eth.defaultAccount = ac;
const abi = fs.readFileSync(path.resolve(__dirname, '../','contracts/v2/output','PermissionsUpgradable.abi'));
const bytecode = fs.readFileSync(path.resolve(__dirname, '../','contracts/v2/output','PermissionsUpgradable.bin'));

var simpleContract = web3.eth.contract(abi);
var a = simpleContract.new("<guardian address>", {from:web3.eth.accounts[0], data: bytecode, gas: 9200000}, function(e, contract) {
	if (e) {
		console.log("err creating contract", e);
	} else {
		if (!contract.address) {
			console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined ...");
		} else {
			console.log("Contract mined! Address: " + contract.address);
			console.log(contract);
		}
	}
}