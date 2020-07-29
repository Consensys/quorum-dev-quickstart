// tslint:disable: no-console

import { FaucetRegistry } from 'pegasys-orchestrate'

export const start = async () => {
  try {
    const faucetRegistry = new FaucetRegistry(process.env.CHAIN_REGISTRY_HOST!)

    const faucet = await faucetRegistry.registerFaucet(
      {
        name: `${process.env.CHAIN}-faucet`,
        chainRule: process.env.CHAIN_UUID!,
        creditorAccount: process.env.FAUCET_ACCOUNT!,
        cooldown: '10s',
        amount: '60000000000000000',
        maxBalance: '100000000000000000'
      },
      process.env.AUTH_TOKEN!
    )

    console.log(faucet)
  } catch (error) {
    console.error(error)
  }
}
