# Enhanced Permissions

## 0. start the quickstart

## 1. Download solidity 
https://github.com/ethereum/solidity/releases/tag/v0.5.17

## 2. Compile contracts
https://consensys.net/docs/goquorum/en/latest/concepts/permissions-overview/#enhanced-network-permissioning
Version 1 - The permissioning rules are applied only at the time of transaction entry with respect to the permissioning data stored in node memory.
Version 2 - The permissioning rules are applied both at the time of transaction entry and block minting with respect to the data stored in the permissioning contracts.

PermissionsInterface.sol : Provide external interface, internal proxy to logical contract
PermissionsImplementation.sol : Logic contract, the actual logic of the contract is in this contract
OrgManager.sol : Data contract, storage organization related data
AccountManager.sol : Data contract, storage account related data
NodeManager.sol : Data contract, storage node first shuts down data
RoleManager.sol ：Data contract, store data first
VoterManager.sol : Data contract, which stores voter data

```bash
cd smart_contracts/permissioning
./compile.sh
```

## 2. Deploy contracts and then execute `init` of `PermissionsUpgradable.sol` with the guardian account that was specified
1. pick a guardian account - we use a predefined test account 
2. Deploy the PermissionsUpgradable.sol contract in the network, which requires specifying a guardian account.
3. Deploy the rest of the contracts, which requires specifying the address of PermissionsUpgradable.sol.

If you miss the contract address output, you can obtain contract addresses of each deployment by doing the following for each in a geth console or geth attach:

```bash
var addr=eth.getTransactionReceipt("insert transaction ID here").contractAddress;
console.log("contract address is :["+addr+"]");
```

## 3. Create/update a file permission-config.json with the following construct 

The file is created as an artifact of step 2, edit the accounts section to suit your requirements and then proceed

```bash
    {
        "permissionModel": "v2",
        "upgradableAddress": "0x1932c48b2bf8102ba33b4a6b545c32236e342f34",
        "interfaceAddress": "0x4d3bfd7821e237ffe84209d8e638f9f309865b87",
        "implAddress": "0xfe0602d820f42800e3ef3f89e1c39cd15f78d283",
        "nodeMgrAddress": "0x8a5e2a6343108babed07899510fb42297938d41f",
        "accountMgrAddress": "0x9d13c6d3afe1721beef56b55d303b09e021e27ab",
        "roleMgrAddress": "0x1349f3e1b8d71effb47b840594ff27da7e603d17",
        "voterMgrAddress": "0xd9d64b7dc034fafdba5dc2902875a67b5d586420",
        "orgMgrAddress" : "0x938781b9796aea6376e40ca158f67fa89d5d8a18",
        "nwAdminOrg": "ADMINORG",
        "nwAdminRole" : "ADMIN",
        "orgAdminRole" : "ORGADMIN",
        "accounts":["0xed9d02e382b34818e88b88a309c7fe71e65f419d", "0xca843569e3427144cead5e4d5999a3d0ccf92b8e"],
        "subOrgBreadth" : 3,
        "subOrgDepth" : 4
    }
```

where:
* permissionModel - Permission model to be used (v1 or v2).
* upgradableAddress- Address of deployed contract PermissionsUpgradable.sol.
* interfaceAddress - Address of deployed contract PermissionsInterface.sol.
* implAddress - Address of deployed contract PermissionsImplementation.sol.
* nodeMgrAddress - Address of deployed contract NodeManager.sol.
* accountMgrAddress - Address of deployed contract AccountManager.sol.
* roleMgrAddress - Address of deployed contract RoleManager.sol.
* voterMgrAddress - Address of deployed contract VoterManager.sol.
* orgMgrAddress - Address of deployed contract OrgManager.sol.
* nwAdminOrg - Name of the initial organization to be created as a part of the network boot up
with a new permissions model. This organization owns all the initial nodes and network
administrator accounts at the network boot up.
* nwAdminRole - Role ID to be assigned to the network administrator accounts.
* orgAdminRole - Role ID to be assigned to the organization administrator account.
* accounts - Initial list of accounts linked to the network administrator organization and assigned
the network administrator role. These accounts have complete control of the network and can propose
and approve new organizations into the network.
* subOrgBreadth - Number of sub-organizations that any organization can have.
* subOrgDepth - Maximum depth of sub-organization hierarchy allowed in the network.

## 4. Copy the above `permission-config.json` into `data` directory of each GoQuorum node and then restart the nodes with the `--permissioned` flag appended to the CLI args

```bash
./scripts/restartNetwork.sh
```

# Important Considerations

On network initialisation:

* A network admin organization is created with the `nwAdminOrg` name that was specified in the `permission-config.json` . All nodes which are part of the `static-nodes.json` will be automatically assigned to this organization.
* A network admin role is created with the `nwAdminRole` name specified in the `permission-config.json`.
* All accounts given in the `accounts` array of the `permission-config.json` file are assigned the network admin role. These accounts can propose and approve new organizations in the network.
