import { renderTemplateDir, validateDirectoryExists, copyFilesDir } from "./fileRendering";
import path from "path";

export interface NetworkContext {
    clientType: "gquorum" | "besu";
    nodeCount: number;
    privacy: boolean;
    outputPath: string;
}

export function buildNetwork(context: NetworkContext): void {
    const templatesDirPath = path.resolve(__dirname, "..", "templates");
    const filesDirPath = path.resolve(__dirname, "..", "files");

    const commonTemplatePath = path.resolve(templatesDirPath, "common");
    const clientTemplatePath = path.resolve(templatesDirPath, context.clientType);

    const commonFilesPath = path.resolve(filesDirPath, "common");
    const clientFilesPath = path.resolve(filesDirPath, context.clientType);

    if (validateDirectoryExists(commonTemplatePath)) {
        renderTemplateDir(commonTemplatePath, context.outputPath, context);
    }

    if (validateDirectoryExists(clientTemplatePath)) {
        renderTemplateDir(clientTemplatePath, context.outputPath, context);
    }

    if (validateDirectoryExists(commonFilesPath)) {
        copyFilesDir(commonFilesPath, context.outputPath);
    }

    if (validateDirectoryExists(clientFilesPath)) {
        copyFilesDir(clientFilesPath, context.outputPath);
    }
}

