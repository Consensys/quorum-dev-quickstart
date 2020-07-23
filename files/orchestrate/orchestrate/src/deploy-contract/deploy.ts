import { TransactionClient } from 'pegasys-orchestrate'
import * as uuid from 'uuid'

export const deploy = async () => {
  const txClient = new TransactionClient(process.env.TX_SCHEDULER_HOST!)

  // Deploy a new Counter contract and return the Transaction
  const idempotencyKey = uuid.v4()
  const authToken = process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : undefined
  const txResponse = await txClient.deployContract(
    {
      chain: process.env.CHAIN!,
      params: {
        contractName: 'Counter',
        from: process.env.FROM_ACCOUNT!
      }
    },
    idempotencyKey,
    authToken
  )

  console.log('Transaction request sent successfully', txResponse)
}
