
// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys

module.exports = {
  tessera: {
    member1: {
      publicKey: "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="
    },
    member2: {
      publicKey: "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="
    },
    member3: {
      publicKey: "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg="
    }
  },
  besu: {
    member1: {
      url: "http://127.0.0.1:20000",
      wsUrl: "ws://127.0.0.1:20001",
      privateKey: "b9a4bd1539c15bcc83fa9078fe89200b6e9e802ae992f13cd83c853f16e8bed4"
    },
    member2: {
      url: "http://127.0.0.1:20002",
      wsUrl: "ws://127.0.0.1:20003",
      privateKey: "f18166704e19b895c1e2698ebc82b4e007e6d2933f4b31be23662dd0ec602570"
    },
    member3: {
      url: "http://127.0.0.1:20004",
      wsUrl: "ws://127.0.0.1:20005",
      privateKey: "4107f0b6bf67a3bc679a15fe36f640415cf4da6a4820affaac89c8b280dfd1b3"
    },
    ethsignerProxy: {
      url: "http://127.0.0.1:18545",
      accountAddress: "9b790656b9ec0db1936ed84b3bea605873558198"
    }
  },
  accounts: {
    "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73" : {
      "privateKey" : "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
    },
    "0x627306090abaB3A6e1400e9345bC60c78a8BEf57" : {
      "privateKey" : "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      },
    "0xf17f52151EbEF6C7334FAD080c5704D77216b732" : {
      "privateKey" : "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      },
    }
};
