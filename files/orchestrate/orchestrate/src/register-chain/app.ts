// tslint:disable: no-console

import { ChainRegistry } from 'pegasys-orchestrate'

export const start = async () => {
  try {
    const chainRegistry = new ChainRegistry(process.env.CHAIN_REGISTRY_HOST!)

    const chain = await chainRegistry.registerChain(
      {
        name: process.env.CHAIN!,
        urls: [process.env.NETWORK_ENDPOINT!]
      },
      process.env.AUTH_TOKEN!
    )

    console.log(chain)
  } catch (error) {
    console.error(error)
  }
}
