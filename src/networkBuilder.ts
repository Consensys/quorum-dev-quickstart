import {renderTemplateDir, validateDirectoryExists, copyFilesDir} from "./fileRendering";
import path from "path";

import {Spinner} from "./spinner";

export interface NetworkContext {
    clientType: "goquorum" | "besu";
    nodeCount: number;
    privacy: boolean;
    monitoring: "splunk" | "elk" | "loki";
    blockscout: boolean;
    chainlens: boolean;
    outputPath: string;
}

export async function buildNetwork(context: NetworkContext): Promise<void> {
    const templatesDirPath = path.resolve(__dirname, "..", "templates");
    const filesDirPath = path.resolve(__dirname, "..", "files");
    const spinner = new Spinner("");

    try {
        const blockchainClient = context.clientType === "besu" ? "Besu" : "GoQuorum" ;

        spinner.text = `Installing ${blockchainClient} quickstart to ${context.outputPath}`;
        spinner.start();

        const commonTemplatePath = path.resolve(templatesDirPath, "common");
        const clientTemplatePath = path.resolve(templatesDirPath, context.clientType);

        const commonFilesPath = path.resolve(filesDirPath, "common");
        const clientFilesPath = path.resolve(filesDirPath, context.clientType);

        if (validateDirectoryExists(commonTemplatePath)) {
            renderTemplateDir(commonTemplatePath, context);
        }

        if (validateDirectoryExists(clientTemplatePath)) {
            renderTemplateDir(clientTemplatePath, context);
        }

        if (validateDirectoryExists(commonFilesPath)) {
            copyFilesDir(commonFilesPath, context);
        }

        if (validateDirectoryExists(clientFilesPath)) {
            copyFilesDir(clientFilesPath, context);
        }

        await spinner.succeed(`Installation complete.`);

        console.log();
        console.log(`To start your test network, run 'run.sh' in the directory, '${context.outputPath}'`);
        console.log(`For more information on the test network, see 'README.md' in the directory, '${context.outputPath}'`);
    } catch (err) {
        if (spinner.isRunning) {
            await spinner.fail(`Installation failed. Error: ${(err as Error).message}`);
        }
        process.exit(1);
    }
}

