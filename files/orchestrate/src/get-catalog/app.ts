// tslint:disable: no-console

import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const contractRegistry = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : "";
    console.log(await contractRegistry.getContractsCatalog(authToken));
  } catch (error) {
    console.error(error);
  }
};
