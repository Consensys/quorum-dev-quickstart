import { TransactionClient } from 'pegasys-orchestrate'
import * as uuid from 'uuid'

export const sendTx = async () => {
  const txClient = new TransactionClient(process.env.TX_SCHEDULER_HOST!)
  const idempotencyKey = uuid.v4()
  const authToken = process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : undefined

  const txResponse = await txClient.send(
    {
      chain: process.env.CHAIN!,
      params: {
        methodSignature: 'increment(uint256)',
        args: [1],
        to: process.env.TO_ACCOUNT!,
        from: process.env.FROM_ACCOUNT!
      }
    },
    idempotencyKey,
    authToken
  )

  console.log('Transaction request sent successfully', txResponse)
}
