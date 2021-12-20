// tslint:disable: no-console

import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const faucetRegistry = new OrchestrateClient(process.env.API_HOST!);

    const faucet = await faucetRegistry.registerFaucet(
      {
        name: `${process.env.CHAIN}-faucet`,
        chainRule: process.env.CHAIN_UUID!,
        creditorAccount: process.env.FAUCET_ACCOUNT!,
        cooldown: "10s",
        amount: "0xD529AE9E860000",
        maxBalance: "0x16345785D8A0000",
      },
      process.env.AUTH_TOKEN
    );

    console.log(faucet);
  } catch (error) {
    console.error(error);
  }
};
