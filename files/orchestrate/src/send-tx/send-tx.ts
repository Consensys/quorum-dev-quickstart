import { OrchestrateClient } from "pegasys-orchestrate";

export const sendTx = async () => {
  const txClient = new OrchestrateClient(process.env.API_HOST!);
  const authToken = process.env.AUTH_TOKEN
    ? `Bearer ${process.env.AUTH_TOKEN}`
    : undefined;

  const txResponse = await txClient.sendTransaction(
    {
      chain: process.env.CHAIN!,
      params: {
        methodSignature: "increment(uint256)",
        args: [1],
        to: process.env.TO_ACCOUNT!,
        from: process.env.FROM_ACCOUNT!,
      },
    },
    undefined,
    authToken
  );

  console.log("Transaction request sent successfully", txResponse);
};
