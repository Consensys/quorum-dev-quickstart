// tslint:disable: no-console

import {IRegisterChainRequest, OrchestrateClient} from "pegasys-orchestrate";

export const start = async () => {
  try {
    const chainRegistry = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : "";

    const chainReq: IRegisterChainRequest = {
        name: process.env.CHAIN!,
        urls: [process.env.NETWORK_ENDPOINT!],
    };

    if (typeof process.env.PRIVATE_NETWORK_ENDPOINT != "undefined") {
      chainReq.privateTxManager = {
        type: "Tessera",
        url: process.env.PRIVATE_NETWORK_ENDPOINT!
      }
    }

    const chain = await chainRegistry.registerChain(chainReq,
      authToken
    );

    console.log(chain);
  } catch (error) {
    console.error(error);
  }
};
