const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");

// member1 details
const { quorum } = require("./keys.js");
const host = quorum.member1.url;
const guardianAddress = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("host"));

const privateKey = quorum.member1.privateKey;
const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
const accountAddress = account.address;

const deployedContractAddresses = {
  PermissionsUpgradable: "",
  OrgManager: "",
  RoleManager: "",
  AccountManager: "",
  VoterManager: "",
  NodeManager: "",
  PermissionsInterface: "",
  PermissionsImplementation: "",
};

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
  await myContract
    .deploy({ data: bytecode, arguments: arguments })
    .send({
      from: accountAddress,
      gas: 9200000,
    })
    .then(function (newContractInstance) {
      console.log(
        `${contract} Contract Address: ${newContractInstance.options.address}`
      );
      deployedContractAddresses[contract] = newContractInstance.options.address;
      return newContractInstance.options.address;
    });
}

contractDeployer("PermissionsUpgradable", [guardianAddress]).then(() => {
  contractDeployer("OrgManager", [
    deployedContractAddresses["PermissionsUpgradable"],
  ]).then(() => {
    contractDeployer("RoleManager", [
      deployedContractAddresses["PermissionsUpgradable"],
    ]).then(() => {
      contractDeployer("AccountManager", [
        deployedContractAddresses["PermissionsUpgradable"],
      ]).then(() => {
        contractDeployer("VoterManager", [
          deployedContractAddresses["PermissionsUpgradable"],
        ]).then(() => {
          contractDeployer("NodeManager", [
            deployedContractAddresses["PermissionsUpgradable"],
          ]).then(() => {
            contractDeployer("PermissionsInterface", [
              deployedContractAddresses["PermissionsUpgradable"],
            ]).then(() => {
              // had to change maxCodeSizeConfig in GoQ to 128kb
              contractDeployer("PermissionsImplementation", [
                deployedContractAddresses["PermissionsUpgradable"],
                deployedContractAddresses["OrgManager"],
                deployedContractAddresses["RoleManager"],
                deployedContractAddresses["AccountManager"],
                deployedContractAddresses["VoterManager"],
                deployedContractAddresses["NodeManager"],
              ]);
            });
          });
        });
      });
    });
  });
});

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
