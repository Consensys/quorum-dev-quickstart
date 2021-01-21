// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : undefined;
    const account = await client.searchAccounts(undefined, authToken);

    console.log(account);
  } catch (error) {
    console.error(error);
  }
};
