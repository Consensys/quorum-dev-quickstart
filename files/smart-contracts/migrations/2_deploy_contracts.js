const SimpleStorage = artifacts.require("SimpleStorage");

//privateFor is an extra transaction parameter for the contract deployment ie its private for a specific account, identified by the given public key (member3)
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage, 42, {privateFor: ["1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="]})
};
