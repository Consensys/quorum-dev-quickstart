
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
  quorum: {
    member1: {
      name: "member1",
      url: "http://127.0.0.1:20000",
      wsUrl: "ws://127.0.0.1:20001",
      privateUrl: "http://127.0.0.1:9081",
      privateKey: "b9a4bd1539c15bcc83fa9078fe89200b6e9e802ae992f13cd83c853f16e8bed4",
      accountAddress: "f0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5"
    },
    member2: {
      name: "member2",
      url: "http://127.0.0.1:20002",
      wsUrl: "ws://127.0.0.1:20003",
      privateUrl: "http://127.0.0.1:9082",
      privateKey: "f18166704e19b895c1e2698ebc82b4e007e6d2933f4b31be23662dd0ec602570",
      accountAddress: "ca843569e3427144cead5e4d5999a3d0ccf92b8e"

    },
    member3: {
      name: "member3",
      url: "http://127.0.0.1:20004",
      wsUrl: "ws://127.0.0.1:20005",
      privateUrl: "http://127.0.0.1:9083",
      privateKey: "4107f0b6bf67a3bc679a15fe36f640415cf4da6a4820affaac89c8b280dfd1b3",
      accountAddress: "0fbdc686b912d7722dc86510934589e0aaf3b55a"
    }
  }
};
