// tslint:disable: no-console

import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const chainRegistry = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : "";
    const chain = await chainRegistry.registerChain(
      {
        name: process.env.CHAIN!,
        urls: [process.env.NETWORK_ENDPOINT!],
      },
      authToken
    );

    console.log(chain);
  } catch (error) {
    console.error(error);
  }
};
