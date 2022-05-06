
// WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys

module.exports = {
  quorum: {
    validator1: {
      name: "validator1",
      url: "http://127.0.0.1:21001",
      nodekey: "1a2c4ff0f1b38e2322658dba692816138eb22d002515df1fffca21278f406aa9",
      accountAddress: "ed9d02e382b34818e88b88a309c7fe71e65f419d"
    },
    validator2: {
      name: "validator1",
      url: "http://127.0.0.1:21002",
      nodekey: "7f9af699dd2bb1af76c90b3f67183dd48abae509c315eb8f2c55301ad90ba978",
      accountAddress: "b30f304642de3fee4365ed5cd06ea2e69d3fd0ca"
    },
    validator3: {
      name: "validator1",
      url: "http://127.0.0.1:21003",
      nodekey: "fe006b00c738e7e5af7f7623290ffc83f394741ae6fb6afc6081cab49e1e1a70",
      accountAddress: "0886328869e4e1f401e1052a5f4aae8b45f42610"
    },
    validator4: {
      name: "validator1",
      url: "http://127.0.0.1:21004",
      nodekey: "8f6ae009cdbbf6e6fa739b91a4483f251bbe89f6570d34856554533b36c93c55",
      accountAddress: "f48de4a0c2939e62891f3c6aca68982975477e45"
    },        
    rpcnode: {
      name: "rpcnode",
      url: "http://127.0.0.1:8545",
      wsUrl: "ws://127.0.0.1:8546",
      nodekey: "0e93a540518eeb673d94fb496b746008ab56605463cb9212493997f5755124d1",
      accountAddress: "c9c913c8c3c1cd416d80a0abf475db2062f161f6"
    },       
    member1: {
      name: "member1",
      url: "http://127.0.0.1:20000",
      wsUrl: "ws://127.0.0.1:20001",
      privateUrl: "http://127.0.0.1:9081",
      nodekey: "b9a4bd1539c15bcc83fa9078fe89200b6e9e802ae992f13cd83c853f16e8bed4",
      accountAddress: "f0e2db6c8dc6c681bb5d6ad121a107f300e9b2b5"
    },
    member2: {
      name: "member2",
      url: "http://127.0.0.1:20002",
      wsUrl: "ws://127.0.0.1:20003",
      privateUrl: "http://127.0.0.1:9082",
      nodekey: "f18166704e19b895c1e2698ebc82b4e007e6d2933f4b31be23662dd0ec602570",
      accountAddress: "ca843569e3427144cead5e4d5999a3d0ccf92b8e"

    },
    member3: {
      name: "member3",
      url: "http://127.0.0.1:20004",
      wsUrl: "ws://127.0.0.1:20005",
      privateUrl: "http://127.0.0.1:9083",
      nodekey: "4107f0b6bf67a3bc679a15fe36f640415cf4da6a4820affaac89c8b280dfd1b3",
      accountAddress: "0fbdc686b912d7722dc86510934589e0aaf3b55a"
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
