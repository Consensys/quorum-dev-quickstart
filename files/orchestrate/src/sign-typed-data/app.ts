// tslint:disable: no-console
import { OrchestrateClient } from "pegasys-orchestrate";

export const start = async () => {
  try {
    const client = new OrchestrateClient(process.env.API_HOST!);

    const signature = await client.signTypedData(
      process.env.FROM_ACCOUNT!,
      {
        domainSeparator: {
          name: "orchestrate",
          version: "v21.01.1",
          chainID: 2029,
          verifyingContract: "0x905B88EFf8Bda1543d4d6f4aA05afef143D27E18",
          salt: "MySalt"
        },
        types: {
          Mail: [
            { name: "sender", type: "address" },
            { name: "recipient", type: "address" },
            { name: "content", type: "string" },
          ]
        },
        message: {
          sender: "0x905B88EFf8Bda1543d4d6f4aA05afef143D27E18",
          recipient: "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73",
          content: "mail content",
        },
        messageType: "Mail"
      },
      process.env.AUTH_TOKEN
    );

    console.log(signature);
  } catch (error) {
    console.error(error);
  }
};
