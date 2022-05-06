
## Important Considerations

- On network initialisation:
    - A network admin organization is created with the `nwAdminOrg` name that was specified in the `permission-config.json` . All nodes which are part of the `static-nodes.json` will be automatically assigned to this organization.
    - A network admin role is created with the `nwAdminRole` name specified in the `permission-config.json`.
    - All accounts given in the `accounts` array of the `permission-config.json` file are assigned the network admin role. These accounts can propose and approve new organizations in the network.


## 0. start the quickstart

## 1. download solidity - you need v 0.5.17 or lower

TODO: fix the contracts arrays so that 0.8.13 can be used
https://github.com/ethereum/solidity/releases/tag/v0.5.17


## 2. compile contracts

https://consensys.net/docs/goquorum/en/latest/concepts/permissions-overview/#enhanced-network-permissioning
Version 1 - The permissioning rules are applied only at the time of transaction entry with respect to the permissioning data stored in node memory.
Version 2 - The permissioning rules are applied both at the time of transaction entry and block minting with respect to the data stored in the permissioning contracts.

Contracts pulled from https://github.com/ConsenSys/quorum-examples/tree/master/examples/7nodes/perm-contracts/v2

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

## 2. deploy contracts

1. pick a guardian account - we use a predefined test account 
2. Deploy the PermissionsUpgradable.sol contract in the network, which requires specifying a guardian account.
3. Deploy the rest of the contracts, which requires specifying the address of PermissionsUpgradable.sol.

If you miss the contract address output, you can obtain contract addresses of each deployment by doing the following for each in a geth console or geth attach:

```bash
var addr=eth.getTransactionReceipt("insert transaction ID here").contractAddress;
console.log("contract address is :["+addr+"]");
```

## 4. Execute `init` of `PermissionsUpgradable.sol` with the guardian account that was specified on deployment

1. Get the ABI for `PermissionsUpgradable.sol` by getting the contents of `./output/PermissionsUpgradable.abi` and pasting after the `var abi` below
2. Run `geth attach ipc:path/to/geth.ipc` on any GoQuorum node and load the following script after replacing `upgr`, `impl`, and `intr` contract addresses:

```bash

ac = eth.accounts[0];
web3.eth.defaultAccount = ac;
var abi = [paste PermissionUpgradable abi here];
var upgr = web3.eth.contract(abi).at("address of the upgradable contracts"); 
var impl = "address of implementation contract";
var intr = "address of interface contract";
var tx = upgr.init(intr, impl, {from: eth.accounts[0], gas: 4500000});
console.log("Init transaction id :["+tx+"]");
```

## 5. stop all nodes before proceeding

## 6. create a file permission-config.json with the following construct

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
    permissionModel - Permission model to be used (v1 or v2).
    upgradableAddress- Address of deployed contract PermissionsUpgradable.sol.
    interfaceAddress - Address of deployed contract PermissionsInterface.sol.
    implAddress - Address of deployed contract PermissionsImplementation.sol.
    nodeMgrAddress - Address of deployed contract NodeManager.sol.
    accountMgrAddress - Address of deployed contract AccountManager.sol.
    roleMgrAddress - Address of deployed contract RoleManager.sol.
    voterMgrAddress - Address of deployed contract VoterManager.sol.
    orgMgrAddress - Address of deployed contract OrgManager.sol.
    nwAdminOrg - Name of the initial organization to be created as a part of the network boot up with a new permissions model. This organization owns all the initial nodes and network administrator accounts at the network boot up.
    nwAdminRole - Role ID to be assigned to the network administrator accounts.
    orgAdminRole - Role ID to be assigned to the organization administrator account.
    accounts - Initial list of accounts linked to the network administrator organization and assigned the network administrator role. These accounts have complete control of the network and can propose and approve new organizations into the network.
    subOrgBreadth - Number of sub-organizations that any organization can have.
    subOrgDepth - Maximum depth of sub-organization hierarchy allowed in the network.
```

`subOrgBreadth`: Number of sub-organizations that any organization can have (int).

`subOrgDepth`: Maximum depth of sub-organisation hierarchy allowed in the network (int).

## 7. Copy the above `permission-config.json` into `data` directory of each GoQuorum node

## 8. Start all nodes in the network and append the `--permissioned` flag to the `geth` start-up command

## 9. 
