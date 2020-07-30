
const PrivateKeyProvider = require("@truffle/hdwallet-provider");

// insert the private key of the account used in metamask eg: Account 1 (Miner Coinbase Account)
const privateKey = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    quickstartWallet: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:8545"),
      network_id: "*"
    }
  }
};
