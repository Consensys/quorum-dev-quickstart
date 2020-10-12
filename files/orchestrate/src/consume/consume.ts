import { Consumer, EventType, ResponseMessage } from 'pegasys-orchestrate'

const STOP_MSG =
  '\n\n---------------------------------------------\nStop consumer by pressing ctrl+c at the end of the quickstart.\n---------------------------------------------\n'

export const consume = async () => {
  const consumer = new Consumer([process.env.KAFKA_HOST!])

  await consumer.connect()
  console.error(STOP_MSG)

  consumer.on(EventType.Response, async (responseMessage: ResponseMessage) => {
    const { offset, topic, value } = responseMessage.content()

    console.log('Message received !', { envelopeId: value.id, offset, topic, chain: value.chain })
    if (value.errors && value.errors.length > 0) {
      console.error('Transaction failed with error: ', value.errors)
    } else {
      console.log('RequestId:', value.id)
      console.log('Receipt: ', JSON.stringify(value.receipt, null, 2))
    }

    await responseMessage.commit()
    console.error(STOP_MSG)
  })

  await consumer.consume()
}
