import { createWriteStream, unlinkSync, readFileSync } from "fs";
import { resolve as resolvePath } from "path";
import got, { HTTPError } from "got";
import { promisify } from "util";
import { pipeline as callbackPipeline } from "stream";

import { getAccessToken, ExtendedToken } from "../auth";
import { ImageManifest, ImageManifestEntry } from "./types";
import { AuthenticationError } from "./authenticationError";
import { AuthorizationError } from "./authorizationError";
import { hasImageTag, loadImage } from "../docker";
import tmp from "tmp";

import { Spinner } from "../../spinner";

const pipeline = promisify(callbackPipeline);


export async function installOrchestrateImages(): Promise<void> {
    const token = await _fetchAuthToken();

    if (!token || !token.token) {
        console.error("No access token returned.");
        throw new Error("No access token returned. Please try again in a few minutes.");
    }

    const accessToken = token.token;

    const manifest = _fetchManifest();

    const spinner = new Spinner("Fetching images").start();

    try {

        const tmpDirDesc = tmp.dirSync({ prefix: "quorum-dev-quickstart" });

        const tmpDir = tmpDirDesc.name;

        const downloadPromises: Promise<string>[] = [];

        for (const entry of manifest.images) {
            if (!await hasImageTag(entry.tag)) {
                const downloadPromise = _downloadImage(accessToken, entry, tmpDir).then(
                    (result: string) => {
                        return result;
                    }
                );
                downloadPromises.push(downloadPromise);
            }
        }

        if (downloadPromises.length > 0) {
            spinner.text = `Importing ${downloadPromises.length} docker image${downloadPromises.length === 1 ? "" : "s"}. This may take a few minutes.`;
            const imagePaths = await Promise.all(downloadPromises);

            for (const imagePath of imagePaths) {
                await loadImage(imagePath);
                unlinkSync(imagePath);
            }
            await spinner.succeed(`Image${downloadPromises.length > 1 ? "s" : ""} imported successfully.`);
        } else {
            await spinner.succeed(`Image${manifest.images.length > 1 ? "s" : ""} already installed, skipped import step.`);
        }
    } catch (err) {
        await spinner.fail(`Error: ${(err as Error).message}`);
        throw err;
    }

}

async function _fetchAuthToken(): Promise<ExtendedToken> {
    const token: ExtendedToken = await getAccessToken();

    if (!token.token) {
        throw new Error("No access token was returned from the auth service.");
    }

    return token;
}

function _fetchManifest(): ImageManifest {
  const rawManifestJson = readFileSync(resolvePath(__dirname, "..", "..", "..", "orchestrate-image-manifest.json"), "utf-8");
  const manifest: ImageManifest = JSON.parse(rawManifestJson) as ImageManifest;
  return manifest;
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
      if (err.response.statusCode === 401) {
        throw new AuthenticationError(
          `There was a problem authenticating your account. Please check your username and password and try again.`
        );
      }

      if (err.response.statusCode === 403) {
        const authZFailureHeaderName = "x-authorization-failure-reason";
        const authZFailureReason = err.response.headers[authZFailureHeaderName];
        if (authZFailureReason) {
          if (authZFailureReason === "trial-not-started") {
            throw new AuthorizationError(
              `Authenticated successfully, but no trial entitlement can be found for this account.`,
              authZFailureReason
            );
          } else if (authZFailureReason === "malformed-trial-expiration") {
            throw new AuthorizationError(
              `Authenticated successfully, but the trial entitlement for this account is malformed. If the problem persists, please file a GitHub issue.`,
              authZFailureReason
            );
          } else if (authZFailureReason === "trial-expired") {
            throw new AuthorizationError(
              "Authenticated successfully, but your trial period for Codefi Orchestrate has " +
              "expired. For other licensing options you can use the form on the following page to " +
              "discuss your options with a member of our sales team:\n" +
              "http://codefi.consensys.net/orchestrate-get-in-touch",
              authZFailureReason
            );
          } else {
            throw new AuthorizationError(
              `There was a permissions issue with your account. Please try again. If the problem persists, please file a GitHub issue.`,
              Array.isArray(authZFailureReason) ? authZFailureReason.join(", ") : authZFailureReason
            );
          }
        }

        throw new Error(`There was a permissions issue with your account. Please try again. If the problem persists, please file a GitHub issue.`);
      }

      if (err.response.statusCode === 404) {
        throw new Error(
          `The image cannot be found. This sometimes happens when the image is` +
          ` being updated. Please wait a minute and try again.`
        );
      }
    }
    throw err;
  }
}

if (require.main === module) {
    void(installOrchestrateImages());
}
