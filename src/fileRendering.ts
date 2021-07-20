import { renderString } from "nunjucks";
import { isBinaryFileSync } from "isbinaryfile";
import { resolve as resolvePath, join as joinPath, dirname } from "path";
import fs from "fs";
import os from "os";
import { NetworkContext } from "./networkBuilder";

export function renderTemplateDir(templateBasePath: string, context: NetworkContext): void {
    const skipDirName = context.clientType === "besu" ? "goquorum" : "besu";
    for (const filePath of _walkDir(templateBasePath, skipDirName)) {
        renderFileToDir(templateBasePath, filePath, context);
    }
}

export function copyFilesDir(filesBasePath: string, context: NetworkContext): void {
    const skipDirName = context.clientType === "besu" ? "goquorum" : "besu";
    for (const filePath of _walkDir(filesBasePath, skipDirName)) {
        const outputPath = resolvePath(context.outputPath, filePath);
        const outputDirname = dirname(outputPath);

        const { mode, size } = fs.statSync(resolvePath(filesBasePath, filePath));

        if (!validateDirectoryExists(outputDirname)) {
            fs.mkdirSync(outputDirname, { recursive: true });
        }

        if (isBinaryFileSync(resolvePath(filesBasePath, filePath), size)) {
            fs.createReadStream(resolvePath(filesBasePath, filePath)).pipe(fs.createWriteStream(outputPath, {
              mode,
            }));
            continue;
        }

        const fileSrc = fs.readFileSync(resolvePath(filesBasePath, filePath), "utf-8");
        const output = fileSrc.replace(/(\r\n|\n|\r)/gm, os.EOL);
        fs.writeFileSync(outputPath, output, { encoding: "utf-8", flag: "w", mode });
    }
}

export function renderFileToDir(basePath: string, filePath: string, context: NetworkContext): void {
    if (!validateDirectoryExists(resolvePath(basePath))) {
        throw new Error(`The template base path '${basePath}' does not exist.`);
    }

    const templatePath = resolvePath(basePath, filePath);
    const outputPath = resolvePath(context.outputPath, filePath);

    if (!_validateFileExists(templatePath)) {
        throw new Error(`The template does not exist at '${templatePath}'.`);
    }

    if (_validateFileExists(outputPath)) {
        throw new Error(`It appears that an output file already exists at '${outputPath}'. Aborting.`);
    }

    const mode = fs.statSync(templatePath).mode;
    const templateSrc = fs.readFileSync(templatePath, "utf-8");
    const output = renderString(templateSrc, context).replace(/(\r\n|\n|\r)/gm, os.EOL);

    const outputDirname = dirname(outputPath);

    if (!validateDirectoryExists(outputDirname)) {
        fs.mkdirSync(outputDirname, { recursive: true });
    }

    fs.writeFileSync(outputPath, output, { encoding: "utf-8", flag: "w", mode });
}

export function validateDirectoryExists(path: string): boolean {
    let stat;

    try {
        stat = fs.statSync(path);
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === "ENOENT") {
          return false;
        }
        throw err;
    }

    if (!stat.isDirectory()) {
        throw new Error(`Path ${path} exists, but is not a directory.`);
    }

    return true;
}


function _validateFileExists(path: string): boolean {
    let stat;

    try {
        stat = fs.statSync(path);
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === "ENOENT") {
            return false;
        }
        throw err;
    }

    if (!stat.isFile()) {
        throw new Error(`Path ${path} exists, but is not a plain file.`);
    }

    return true;
}

function* _walkDir(dir: string, skipDirName?: string, basePath = ""): Iterable<string> {
    const files = fs.readdirSync(resolvePath(dir));
    for (const f of files) {
        const dirPath = resolvePath(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            yield *_walkDir(dirPath, skipDirName, joinPath(basePath, f));
        } else {
            yield joinPath(basePath, f);
        }
    }
}
