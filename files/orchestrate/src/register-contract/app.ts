// tslint:disable: no-console

import { ContractRegistry } from 'pegasys-orchestrate'

import * as Counter from '../../build/contracts/Counter.json'

export const start = async () => {
  try {
    const contractRegistry = new ContractRegistry(process.env.CONTRACT_REGISTRY_HOST!)

    const authToken = process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : ''
    await contractRegistry.register({
      name: 'Counter',
      abi: Counter.abi,
      bytecode: Counter.bytecode,
      deployedBytecode: Counter.deployedBytecode,
      authToken
    })

    console.log(await contractRegistry.get('Counter', undefined, authToken))
  } catch (error) {
    console.error(error)
  }
}
