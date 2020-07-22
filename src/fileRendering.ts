import { render } from "nunjucks";
import { resolve as resolvePath, join as joinPath, dirname } from "path";
import fs from "fs";
import { AnswerMap } from "./questions";

export function renderTemplateDir(templateBasePath: string, destinationBasePath: string, context: AnswerMap): void {
    for (const filePath of _walkDir(templateBasePath)) {
        renderFileToDir(templateBasePath, destinationBasePath, filePath, context);
    }
}

export function copyFilesDir(filesBasePath: string, destinationBasePath: string): void {
    for (const filePath of _walkDir(filesBasePath)) {
        const outputPath = resolvePath(destinationBasePath, filePath);
        const outputDirname = dirname(outputPath);

        if (!validateDirectoryExists(outputDirname)) {
            fs.mkdirSync(outputDirname, { recursive: true });
        }
        fs.copyFileSync(resolvePath(filesBasePath, filePath), outputPath);
    }
}

export function renderFileToDir(basePath: string, destinationBasePath: string, filePath: string, context: AnswerMap): void {
    if (!validateDirectoryExists(resolvePath(basePath))) {
        throw new Error(`The template base path '${basePath}' does not exist.`);
    }

    const templatePath = resolvePath(basePath, filePath);
    const outputPath = resolvePath(destinationBasePath, filePath);

    if (!_validateFileExists(templatePath)) {
        throw new Error(`The template does not exist at '${templatePath}'.`);
    }

    if (_validateFileExists(outputPath)) {
        throw new Error(`It appears that an output file already exists at '${outputPath}'. Aborting.`);
    }

    const output = render(templatePath, context);

    const outputDirname = dirname(outputPath);

    if (!validateDirectoryExists(outputDirname)) {
        fs.mkdirSync(outputDirname, { recursive: true });
    }

    fs.writeFileSync(outputPath, output, { encoding: "utf-8", flag: "w" });
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

function* _walkDir(dir: string, basePath = ""): Iterable<string> {
    const files = fs.readdirSync(resolvePath(dir));
    for (const f of files) {
        const dirPath = resolvePath(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            yield *_walkDir(dirPath, joinPath(basePath, f));
        } else {
            yield joinPath(basePath, f);
        }
    }
}