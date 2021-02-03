import { OrchestrateClient } from 'pegasys-orchestrate'
import * as uuid from 'uuid'

export const deploy = async () => {
  const txClient = new OrchestrateClient(process.env.API_HOST!);
  const idempotencyKey = uuid.v4();

  const txResponse = await txClient.deployContract(
    {
      chain: process.env.CHAIN!,
      params: {
        contractName: 'Counter',
        from: process.env.FROM_ACCOUNT!
      }
    },
    idempotencyKey,
    process.env.AUTH_TOKEN
  );

  console.log('Transaction request sent successfully', txResponse)
};
