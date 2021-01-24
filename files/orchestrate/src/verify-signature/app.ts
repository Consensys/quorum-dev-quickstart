// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : undefined;
    await client.verifySignature({
        data: process.env.DATA_TO_SIGN!,
        signature: process.env.SIGNATURE!,
        address: process.env.FROM_ACCOUNT!
      },
      authToken
    );

    console.log("Signature was verified successfully");
  } catch (error) {
    console.error(error);
  }
};
