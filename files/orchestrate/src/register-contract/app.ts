// tslint:disable: no-console

import { ContractRegistry } from 'pegasys-orchestrate'

import * as Counter from '../../build/contracts/Counter.json'
import * as ERC20 from '../../build/contracts/ERC20.json'

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

    await contractRegistry.register({
      name: 'ERC20',
      abi: ERC20.abi,
      bytecode: ERC20.bytecode,
      deployedBytecode: ERC20.deployedBytecode,
      authToken
    })

    console.log(await contractRegistry.get('ERC20', undefined, authToken))
  } catch (error) {
    console.error(error)
  }
}
