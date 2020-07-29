// tslint:disable: no-console
import { AccountGenerator } from 'pegasys-orchestrate'

export const start = async () => {
  try {
    const accountGenerator = new AccountGenerator([process.env.KAFKA_HOST!], undefined, undefined, {
      groupId: 'quick-start'
    })

    await accountGenerator.connect()
    const address = await accountGenerator.generateAccount({
      authToken: process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : '',
      chain: process.env.CHAIN!
    })
    await accountGenerator.disconnect()

    console.log(address)
  } catch (error) {
    console.error(error)
  }
}
