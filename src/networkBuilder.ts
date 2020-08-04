import { installOrchestrateImages } from "./service/orchestrate";
import { renderTemplateDir, validateDirectoryExists, copyFilesDir } from "./fileRendering";
import path from "path";

export interface NetworkContext {
    clientType: "gquorum" | "besu";
    nodeCount: number;
    privacy: boolean;
    outputPath: string;
    orchestrate: boolean;
}

export async function buildNetwork(context: NetworkContext): Promise<void> {
    const templatesDirPath = path.resolve(__dirname, "..", "templates");
    const filesDirPath = path.resolve(__dirname, "..", "files");

    if (context.orchestrate) {
        console.log(`Installing ${context.clientType === "besu" ? "Besu" : "GoQuorum"}/Orchestrate quickstart to ${context.outputPath}`);
        await installOrchestrateImages();
        const orchestrateTemplatePath = path.resolve(templatesDirPath, "orchestrate");
        const orchestrateFilesPath = path.resolve(filesDirPath, "orchestrate");

        if (validateDirectoryExists(orchestrateTemplatePath)) {
            renderTemplateDir(orchestrateTemplatePath, context);
        }

        if (validateDirectoryExists(orchestrateFilesPath)) {
            copyFilesDir(orchestrateFilesPath, context);
        }
    } else {
        console.log(`Installing ${context.clientType === "besu" ? "Besu" : "GoQuorum"} quickstart to ${context.outputPath}`);

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
    }
    console.log(`Installation complete. To start your test network, run 'run.sh' in the installation directory.`);
}

