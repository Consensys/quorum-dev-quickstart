const ethers = require("ethers");
const fs = require("fs-extra");
const path = require("path");

// member1 details
const { quorum } = require("./keys.js");
const host = quorum.member1.url;
const guardianAddress = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";

const provider = new ethers.providers.JsonRpcProvider(host);

const privateKey = quorum.member1.accountPrivateKey;
const wallet = new ethers.Wallet(privateKey, provider);

async function contractDeployer(contractName, ...argumentss) {
  const abi = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../",
        "contracts/v2/output",
        `${contractName}.abi`
      )
    )
  );
  const bytecode = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../",
        "contracts/v2/output",
        `${contractName}.bin`
      )
    )
    .toString();
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(...argumentss);
  await contract.deployTransaction.wait();
  console.log(`${contractName} Contract Address: ${contract.address}`);
  return contract.address;
}

(async function main() {
  const permissionUpgradableAddress = await contractDeployer(
    "PermissionsUpgradable",
    guardianAddress
  );
  const orgManagerAddress = await contractDeployer(
    "OrgManager",
    permissionUpgradableAddress
  );
  const roleManagerAddress = await contractDeployer(
    "RoleManager",
    permissionUpgradableAddress
  );
  const accountManagerAddress = await contractDeployer(
    "AccountManager",
    permissionUpgradableAddress
  );
  const voterManagerAddress = await contractDeployer(
    "VoterManager",
    permissionUpgradableAddress
  );
  const nodeManagerAddress = await contractDeployer(
    "NodeManager",
    permissionUpgradableAddress
  );
  const permissionsInterfaceAddress = await contractDeployer(
    "PermissionsInterface",
    permissionUpgradableAddress
  );
  const permissionsImplementationAddress = await contractDeployer(
    "PermissionsImplementation",
    permissionUpgradableAddress,
    orgManagerAddress,
    roleManagerAddress,
    accountManagerAddress,
    voterManagerAddress,
    nodeManagerAddress
  );
})();
