// tslint:disable: no-console

import { OrchestrateClient } from "pegasys-orchestrate";

import * as Counter from "../../build/contracts/Counter.json";
import * as ERC20 from "../../build/contracts/ERC20.json";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const authToken = process.env.AUTH_TOKEN
      ? `Bearer ${process.env.AUTH_TOKEN}`
      : "";
    await client.registerContract(
      {
        name: "Counter",
        abi: Counter.abi,
        bytecode: Counter.bytecode,
        deployedBytecode: Counter.deployedBytecode,
      },
      authToken
    );

    console.log(await client.getContract("Counter", undefined, authToken));

    await client.registerContract(
      {
        name: "ERC20",
        abi: ERC20.abi,
        bytecode: ERC20.bytecode,
        deployedBytecode: ERC20.deployedBytecode,
      },
      authToken
    );

    console.log(await client.getContract("ERC20", undefined, authToken));
  } catch (error) {
    console.error(error);
  }
};
