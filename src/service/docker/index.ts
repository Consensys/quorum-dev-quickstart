import got from "got";

import { pipeline as callbackPipeline } from "stream";
import { promisify } from "util";
import { createReadStream } from "fs";
import { createGunzip } from "zlib";
import { resolve as resolvePath } from "path";

const pipeline = promisify(callbackPipeline);

import { HTTPError } from "got";

const DOCKER_SOCKET_PATH = "/var/run/docker.sock";

export async function hasImageTag(tag: string): Promise<boolean> {
  try {
    const response = got(_dockerUrl(`/images/${tag}/json`));

    const inspectImageResult = await response.json<InspectImageResult>();

    if (inspectImageResult.RepoTags.includes(tag)) {
      return true;
    }

    return false;
  } catch (err) {
    if (err instanceof HTTPError) {
      if (err.response.statusCode === 404) {
        return false;
      }
    }
    throw err;
  }
}

export async function loadImage(filePath: string): Promise<void> {
  const readStream = createReadStream(resolvePath(filePath));
  const gunzipStream = createGunzip();
  const postWriteStream = got.stream.post(_dockerUrl("/images/load"), {
    headers: {
      "Content-Type": "application/tar"
    }
  });

  await pipeline(
    readStream,
    gunzipStream,
    postWriteStream
  );
}

function _dockerUrl(path: string): string {
  return `http://unix:${DOCKER_SOCKET_PATH}:${path.startsWith("/") ? path : "/" + path}`;
}

interface InspectImageResult {
  Id: string;
  Parent: string;
  RepoTags: string[];
  message?: string;
}

if (require.main === module) {
  void(async function() {
    if (process.argv.length < 4) {
      console.error("Usage: programName dockerTag importPath");
      process.exit(1);
    }

    console.log(`Has tag ${process.argv[2]}? ${(await hasImageTag(process.argv[2])) ? "yes" : "no"}`);

    console.log(`Importing from ${resolvePath(process.argv[3])}`);

    await loadImage(process.argv[3]);

    console.log(`Has tag ${process.argv[2]}? ${(await hasImageTag(process.argv[2])) ? "yes" : "no"}`);
  })();
}
