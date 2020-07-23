// tslint:disable: no-console

import { ContractRegistry } from 'pegasys-orchestrate'

export const start = async () => {
  try {
    const contractRegistry = new ContractRegistry(process.env.CONTRACT_REGISTRY_HOST!)

    const authToken = process.env.AUTH_TOKEN ? `Bearer ${process.env.AUTH_TOKEN}` : ''
    console.log(await contractRegistry.getCatalog(authToken))
  } catch (error) {
    console.error(error)
  }
}
