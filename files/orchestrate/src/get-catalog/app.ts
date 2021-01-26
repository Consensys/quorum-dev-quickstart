// tslint:disable: no-console

import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const contractRegistry = new OrchestrateClient(process.env.API_HOST!);
    console.log(await contractRegistry.getContractsCatalog(process.env.AUTH_TOKEN));
  } catch (error) {
    console.error(error);
  }
};
