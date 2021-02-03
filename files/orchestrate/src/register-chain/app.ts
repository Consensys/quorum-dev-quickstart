// tslint:disable: no-console

import {IRegisterChainRequest, OrchestrateClient} from "pegasys-orchestrate";

export const start = async () => {
  try {
    const chainRegistry = new OrchestrateClient(process.env.API_HOST!);

    const chainReq: IRegisterChainRequest = {
      name: process.env.CHAIN!,
      urls: [process.env.NETWORK_ENDPOINT!],
    };

    if (process.env.PRIVATE_NETWORK_ENDPOINT) {
      chainReq.privateTxManager = {
        type: "Tessera",
        url: process.env.PRIVATE_NETWORK_ENDPOINT!
      }
    }

    const chain = await chainRegistry.registerChain(chainReq, process.env.AUTH_TOKEN);

    console.log(chain);
  } catch (error) {
    console.error(error);
  }
};
