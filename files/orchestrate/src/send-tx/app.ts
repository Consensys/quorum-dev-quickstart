import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  const txClient = new OrchestrateClient(process.env.API_HOST!);
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
    process.env.AUTH_TOKEN
  );

  console.log("Transaction request sent successfully", txResponse);
};
