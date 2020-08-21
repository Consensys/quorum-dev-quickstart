
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    member1: {
      host: "127.0.0.1",
      port: 20000,
      network_id: "*",
      gasPrice: 0,
      gas: 4500000,
//      type: "quorum"
    },
    member2:  {
      host: "127.0.0.1",
      port: 20002,
      network_id: "*",
      gasPrice: 0,
      gas: 4500000,
//      type: "quorum"
    },
    member3:  {
      host: "127.0.0.1",
      port: 20004,
      network_id: "*",
      gasPrice: 0,
      gas: 4500000,
//      type: "quorum"
    }
  }
};
