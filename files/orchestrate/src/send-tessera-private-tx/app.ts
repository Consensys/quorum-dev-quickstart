import { ProtocolType, OrchestrateClient } from 'pegasys-orchestrate'
import * as uuid from 'uuid'

export const start = async () => {
  const txClient = new OrchestrateClient(process.env.API_HOST!);
  const idempotencyKey = uuid.v4();

  // Deploy contract in private network between two private participants
  const txResponse = await txClient.deployContract(
    {
      chain: process.env.CHAIN!,
      params: {
        contractName: 'Counter',
        from: process.env.FROM_ACCOUNT!,
        protocol: ProtocolType.Tessera,
        privateFrom: process.env.TESSERA1_MEMBER_KEY,  // Tessera node 1 public key
        privateFor: [process.env.TESSERA2_MEMBER_KEY!] // Tessera node 2 public key
      }
    },
    idempotencyKey,
    process.env.AUTH_TOKEN
  );

  console.log('Transaction request sent successfully', txResponse);
};
