// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

function convertToHex(str: string) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return "0x" + hex;
}

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const signature = await client.signMessage(
      process.env.FROM_ACCOUNT!,
      { message: convertToHex(process.env.DATA_TO_SIGN!) },
      process.env.AUTH_TOKEN
    );

    console.log(signature);
  } catch (error) {
    console.error(error);
  }
};
