import { renderTemplateDir, validateDirectoryExists, copyFilesDir } from "./fileRendering";
import path from "path";

export interface NetworkContext {
    clientType: "gquorum" | "besu";
    nodeCount: number;
    privacy: boolean;
    outputPath: string;
    orchestrate: boolean;
}

export function buildNetwork(context: NetworkContext): void {
    const templatesDirPath = path.resolve(__dirname, "..", "templates");
    const filesDirPath = path.resolve(__dirname, "..", "files");

    const commonTemplatePath = path.resolve(templatesDirPath, "common");
    const clientTemplatePath = path.resolve(templatesDirPath, context.clientType);
    const orchestrateTemplatePath = path.resolve(templatesDirPath, "orchestrate");

    const commonFilesPath = path.resolve(filesDirPath, "common");
    const clientFilesPath = path.resolve(filesDirPath, context.clientType);
    const orchestrateFilesPath = path.resolve(filesDirPath, "orchestrate");

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

    if (context.orchestrate) {
        // update the output dir to be a subdirectory of the one given by the user
        const orchestrateContext = {
            ...context,
            outputPath: path.resolve(context.outputPath, "orchestrate")
        };

        if (validateDirectoryExists(orchestrateTemplatePath)) {
            renderTemplateDir(orchestrateTemplatePath, orchestrateContext);
        }

        if (validateDirectoryExists(orchestrateFilesPath)) {
            copyFilesDir(orchestrateFilesPath, orchestrateContext);
        }
    }
}

