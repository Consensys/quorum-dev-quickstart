const secp256k1 = require('secp256k1')
const keccak = require('keccak')
const { randomBytes } = require('crypto')
const fs = require('fs')
const Web3 = require('web3');
 
let web3 = new Web3('http://localhost:8545')
let account = web3.eth.accounts.create();
var V3KeyStore = web3.eth.accounts.encrypt(account.privateKey, "Password");
console.log(JSON.stringify(V3KeyStore));

function generatePrivateKey() {
  let privKey
  do {
    privKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privKey))
  return privKey
}

function derivePublicKey(privKey) {
  // slice on the end to remove the compression prefix ie. uncompressed use 04 prefix & compressed use 02 or 03
  // we generate the address, which wont work with the compression prefix
  let pubKey = secp256k1.publicKeyCreate(privKey, false).slice(1)
  return Buffer.from(pubKey)
}
  
function deriveAddress(pubKey) {
  if(!Buffer.isBuffer(pubKey)) {
    console.log("ERROR - pubKey is not a buffer")
  }
  let keyHash = keccak('keccak256').update(pubKey).digest()
  return keyHash.slice(Math.max(keyHash.length - 20, 1))
}
  
function generateNodeData() {
  let privateKey = generatePrivateKey()
  let publicKey = derivePublicKey(privateKey)
  let address = deriveAddress(publicKey)
  return {
    privateKey : privateKey,
    publicKey: publicKey,
    address: address,
  }
}

function generateV3Keystore(host, password) {
  let web3 = new Web3(host)
  let account = web3.eth.accounts.create();
  var V3KeyStore = web3.eth.accounts.encrypt(account.privateKey, password);
  return {
    privateKey: account.privateKey,
    keystore: JSON.stringify(V3KeyStore),
    password: password
  }
}

keydata = generateNodeData();
console.log("keys created, writing to file...")
fs.writeFileSync("nodekey", keydata.privateKey.toString('hex'));
fs.writeFileSync("nodekey.pub", keydata.publicKey.toString('hex'));
fs.writeFileSync("address", keydata.address.toString('hex'));

// Ensure you run this with a running node ie 'http://localhost:8545'
account = generateV3Keystore('http://localhost:8545', 'Password');
console.log("account created, writing to file...")
fs.writeFileSync("account", account.keystore);
fs.writeFileSync("account.key", account.privateKey);
fs.writeFileSync("account.password", account.password);
