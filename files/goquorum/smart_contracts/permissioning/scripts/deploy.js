const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");

// member1 details
const { quorum } = require("./keys.js");
const host = quorum.member1.url;
const guardianAddress = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(host));

const privateKey = quorum.member1.privateKey;
const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
const accountAddress = account.address;

async function contractDeployer(contract, arguments) {
  const abi = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../", "contracts/v2/output", `${contract}.abi`)
    )
  );
  const bytecode = fs
    .readFileSync(
      path.resolve(__dirname, "../", "contracts/v2/output", `${contract}.bin`)
    )
    .toString();
  let myContract = new web3.eth.Contract(abi);
  const res = await myContract
    .deploy({ data: bytecode, arguments: arguments })
    .send({
      from: accountAddress,
      // gas: 9200000,
    });
  console.log(`${contract} Contract Address: ${res.options.address}`);
  return res.options.address;
}

(async function main() {
  const permissionUpgradableAddress = await contractDeployer(
    "PermissionsUpgradable",
    [guardianAddress]
  );
  const orgManagerAddress = await contractDeployer("OrgManager", [
    permissionUpgradableAddress,
  ]);
  const roleManagerAddress = await contractDeployer("RoleManager", [
    permissionUpgradableAddress,
  ]);
  const accountManagerAddress = await contractDeployer("AccountManager", [
    permissionUpgradableAddress,
  ]);
  const voterManagerAddress = await contractDeployer("VoterManager", [
    permissionUpgradableAddress,
  ]);
  const nodeManagerAddress = await contractDeployer("NodeManager", [
    permissionUpgradableAddress,
  ]);
  const permissionsInterfaceAddress = await contractDeployer(
    "PermissionsInterface",
    [permissionUpgradableAddress]
  );
  const permissionsImplementationAddress = await contractDeployer(
    "PermissionsImplementation",
    [
      permissionUpgradableAddress,
      orgManagerAddress,
      roleManagerAddress,
      accountManagerAddress,
      voterManagerAddress,
      nodeManagerAddress,
    ]
  );
})();

// const upgr = new web3.eth.Contract(abi).at(address);
// const tx = upgr.init(
//   deployedContractAddresses["PermissionsInterface"],
//   deployedContractAddresses["PermissionsImplementation"],
//   {
//     from: account,
//     gas: 4500000,
//   }
// );
// console.log(`Init transaction id: ${tx}`);
