
// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys

module.exports = {
  tessera: {
    member1: {
      publicKey: "A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo="
    },
    member2: {
      publicKey: "Ko2bVqD+nNlNYL5EE7y3IdOnviftjiizpjRt+HTuFBs="
    },
    member3: {
      publicKey: "k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8="
    }
  },
  besu: {
    member1: {
      url: "http://127.0.0.1:20000",
      wsUrl: "ws://127.0.0.1:20001",
      privateKey:
        "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"
    },
    member2: {
      url: "http://127.0.0.1:20002",
      wsUrl: "ws://127.0.0.1:20003",
      privateKey:
        "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
    },
    member3: {
      url: "http://127.0.0.1:20004",
      wsUrl: "ws://127.0.0.1:20005",
      privateKey:
        "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f"
    }
  }
};
