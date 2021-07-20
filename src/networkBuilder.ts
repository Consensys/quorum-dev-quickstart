import {installOrchestrateImages} from "./service/orchestrate";
import {renderTemplateDir, validateDirectoryExists, copyFilesDir} from "./fileRendering";
import path from "path";

import {Spinner} from "./spinner";

export interface NetworkContext {
    clientType: "goquorum" | "besu";
    nodeCount: number;
    privacy: boolean;
    monitoring: "splunk" | "elk" | "none";
    outputPath: string;
    orchestrate: boolean;
}

export async function buildNetwork(context: NetworkContext): Promise<void> {
    const templatesDirPath = path.resolve(__dirname, "..", "templates");
    const filesDirPath = path.resolve(__dirname, "..", "files");
    const spinner = new Spinner("");
    let orchestrateOutputPath = "";

    try {
        if (context.orchestrate) {
            spinner.text = `Installing Orchestrate quickstart with ` +
                `${context.clientType === "besu" ? "Besu" : "GoQuorum"} clients to` +
                `${context.outputPath}`;

            await installOrchestrateImages();

            spinner.start();
            const orchestrateTemplatePath = path.resolve(templatesDirPath, "orchestrate");
            const orchestrateFilesPath = path.resolve(filesDirPath, "orchestrate");

            if (validateDirectoryExists(orchestrateTemplatePath)) {
                renderTemplateDir(orchestrateTemplatePath, context);
            }

            if (validateDirectoryExists(orchestrateFilesPath)) {
                copyFilesDir(orchestrateFilesPath, context);
            }

            orchestrateOutputPath = context.outputPath;
            context.outputPath += "/network";
            context.privacy = true;
            context.monitoring = "none";
            context.nodeCount = 3;
        }

        spinner.text = `Installing ` +
            `${context.clientType === "besu" ? "Besu" : "GoQuorum"} quickstart ` +
            `to ${context.outputPath}`;
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

        if (context.orchestrate) {
            console.log();
            console.log(`To start Orchestrate, run 'npm install' and 'npm start' in the directory, '${orchestrateOutputPath}'`);
            console.log(`For more information on the Orchestrate, see 'README.md' in the directory, '${orchestrateOutputPath}'`);
        } else {
            console.log();
            console.log(`To start your test network, run 'run.sh' in the directory, '${context.outputPath}'`);
            console.log(`For more information on the test network, see 'README.md' in the directory, '${context.outputPath}'`);
        }
    } catch (err) {
        if (spinner.isRunning) {
            await spinner.fail(`Installation failed. Error: ${(err as Error).message}`);
        }
        process.exit(1);
    }
}

