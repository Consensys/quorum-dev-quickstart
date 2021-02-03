// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);
    const account = await client.searchAccounts(undefined, process.env.AUTH_TOKEN);

    console.log(account);
  } catch (error) {
    console.error(error);
  }
};
