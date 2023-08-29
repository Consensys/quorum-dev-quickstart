const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");

// validator1 details
const { quorum, accounts } = require("./keys.js");
const host = quorum.validator1.url;
const guardianAddress = quorum.validator1.accountAddress;

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(host));

function createPermissionConfigFile(
  permissionUpgradableAddress,
  orgManagerAddress,
  roleManagerAddress,
  accountManagerAddress,
  voterManagerAddress,
  nodeManagerAddress,
  permissionsInterfaceAddress,
  permissionsImplementationAddress
) {
  let adminAccounts = Object.keys(quorum).map(
    (i) => quorum[i]["accountAddress"]
  );
  let permissions = {
    permissionModel: "v2",
    upgradableAddress: permissionUpgradableAddress,
    interfaceAddress: permissionsInterfaceAddress,
    implAddress: permissionsImplementationAddress,
    nodeMgrAddress: nodeManagerAddress,
    accountMgrAddress: accountManagerAddress,
    roleMgrAddress: roleManagerAddress,
    voterMgrAddress: voterManagerAddress,
    orgMgrAddress: orgManagerAddress,
    nwAdminOrg: "ADMINORG",
    nwAdminRole: "ADMIN",
    orgAdminRole: "ORGADMIN",
    accounts: adminAccounts,
    subOrgBreadth: 3,
    subOrgDepth: 4,
  };
  fs.writeJsonSync("permission-config.json", permissions, { spaces: 2 });
  return permissions;
}

async function contractDeployer(account, contract, arguments) {
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
      from: account,
      // gas: 9200000,  TODO: why does this fail when this line is in?
    });
  console.log(res);
  console.log(`${contract} Contract Address: ${res.options.address}`);
  return res.options.address;
}

async function main() {
  // returns a list of accounts that the node can use
  const accounts = await web3.eth.getAccounts();

  console.log(
    "******************* Deploying Contracts *******************"
  );
  // step 3. deploy the contracts
  const permissionUpgradableAddress = await contractDeployer(
    accounts[0],
    "PermissionsUpgradable",
    [guardianAddress]
  );
  const orgManagerAddress = await contractDeployer(accounts[0], "OrgManager", [
    permissionUpgradableAddress,
  ]);
  const roleManagerAddress = await contractDeployer(
    accounts[0],
    "RoleManager",
    [permissionUpgradableAddress]
  );
  const accountManagerAddress = await contractDeployer(
    accounts[0],
    "AccountManager",
    [permissionUpgradableAddress]
  );
  const voterManagerAddress = await contractDeployer(
    accounts[0],
    "VoterManager",
    [permissionUpgradableAddress]
  );
  const nodeManagerAddress = await contractDeployer(
    accounts[0],
    "NodeManager",
    [permissionUpgradableAddress]
  );
  const permissionsInterfaceAddress = await contractDeployer(
    accounts[0],
    "PermissionsInterface",
    [permissionUpgradableAddress]
  );
  const permissionsImplementationAddress = await contractDeployer(
    accounts[0],
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

  console.log(
    "******************* Contracts deployed, beginning Init *******************"
  );

  // step 4. Execute `init` of `PermissionsUpgradable.sol` with the guardian account that was specified on deployment
  const abi = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../",
        "contracts/v2/output",
        `PermissionsUpgradable.abi`
      )
    )
  );
  const upgr = new web3.eth.Contract(abi, permissionUpgradableAddress);
  const tx = await upgr.methods
    .init(permissionsInterfaceAddress, permissionsImplementationAddress)
    .send({
      from: accounts[0],
      gas: 4500000,
      gasLimit: 5000000,
    });
  console.log(`Init() transaction id: ${JSON.stringify(tx)}`);

  // 5. create a file permission-config.json with the following construct
  console.log(
    "******************* Init done, Create the permissions-config.json file *******************"
  );
  createPermissionConfigFile(
    permissionUpgradableAddress,
    orgManagerAddress,
    roleManagerAddress,
    accountManagerAddress,
    voterManagerAddress,
    nodeManagerAddress,
    permissionsInterfaceAddress,
    permissionsImplementationAddress
  );
  
  // 7. Copy the above `permission-config.json` into `data` directory of each GoQuorum node
  console.log(
    "******* Please copy the permissions-config.json file to the `permissions` directory (using sudo) and restart the nodes ********"
  );
  console.log("");
  console.log(
    "./restartNetwork.sh"
  );

  
}

if (require.main === module) {
  main();
}

module.exports = exports = main;
