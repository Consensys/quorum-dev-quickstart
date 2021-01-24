// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : undefined;
    const signature = await client.sign(
      process.env.FROM_ACCOUNT!,
      process.env.DATA_TO_SIGN!,
      authToken
    );

    console.log(signature);
  } catch (error) {
    console.error(error);
  }
};
