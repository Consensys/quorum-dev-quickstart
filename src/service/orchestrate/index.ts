import { createWriteStream, unlinkSync } from "fs";
import { resolve as resolvePath } from "path";
import got, { HTTPError } from "got";
import { promisify } from "util";
import { pipeline as callbackPipeline } from "stream";

import { getAccessToken, ExtendedToken } from "../auth";
import { ImageManifest, ImageManifestEntry } from "./types";
import { hasImageTag, loadImage } from "../docker";
import tmp from "tmp";

const pipeline = promisify(callbackPipeline);


export async function installOrchestrateImages(): Promise<void> {
    const token = await _fetchAuthToken();

    if (!token.token) {
        console.error("No access token returned.");
        throw new Error("No access token returned. Please try again in a few minutes.");
    }

    const accessToken = token.token;

    const manifest = await _fetchManifest(accessToken);

    const tmpDirDesc = tmp.dirSync({ prefix: "quorum-dev-quickstart" });

    const tmpDir = tmpDirDesc.name;

    const downloadPromises: Promise<string>[] = [];

    for (const entry of manifest.images) {
        if (!await hasImageTag(entry.tag)) {
            console.log(`Downloading docker image ${entry.tag}`);
            const downloadPromise = _downloadImage(accessToken, entry, tmpDir).then(
                (result: string) => {
                    console.log(`Docker image ${entry.tag} download complete.`);
                    return result;
                }
            );
            downloadPromises.push(downloadPromise);
        } else {
            console.log(`Docker image ${entry.tag} is already installed, skipping image download.`);
        }
    }

    const imagePaths = await Promise.all(downloadPromises);

    for (const imagePath of imagePaths) {
        await loadImage(imagePath);
        unlinkSync(imagePath);
    }
}

async function _fetchAuthToken(): Promise<ExtendedToken> {
    const token: ExtendedToken = await getAccessToken();

    if (!token.token) {
        throw new Error("No access token was returned from the auth service.");
    }

    return token;
}

async function _fetchManifest(token: string): Promise<ImageManifest> {
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const relayUrlBase = process.env.QUORUM_DEV_QUICKSTART_RELAY_URL ?
        process.env.QUORUM_DEV_QUICKSTART_RELAY_URL :
        "https://relay.quorum.consensys.net";

    try {
        const manifestUrl = `${relayUrlBase}/quorum-dev-quickstart/manifest`;
        return await got(manifestUrl, {
            headers
        }).json<ImageManifest>();


    } catch (err) {
        if (err instanceof HTTPError) {
            if (err.response.statusCode === 403) {
                throw new Error(`There was a problem authenticating your account. Please try again.`);
            }
            if (err.response.statusCode === 404) {
                throw new Error(
                    `The image manifest cannot be found. ` +
                    `This sometimes happens when the image is being updated. ` +
                    `Please wait a minute and try again.`
                );
            }
        }
        throw err;
    }
}

async function _downloadImage(token: string, entry: ImageManifestEntry, tmpDir: string): Promise<string> {
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const requestStream = got.stream(entry.url, { headers });

        const savePath = resolvePath(tmpDir, entry.fileName);
        const outputStream = createWriteStream(savePath);

        await pipeline(requestStream, outputStream);

        return savePath;
    } catch (err) {
        if (err instanceof HTTPError) {
            if (err.response.statusCode === 403) {
                throw new Error(`There was a problem authenticating your account. Please try again.`);
            }
        }
        throw err;
    }
}

if (require.main === module) {
    void(installOrchestrateImages());
}
