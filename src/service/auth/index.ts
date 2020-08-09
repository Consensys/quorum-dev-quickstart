import express, { Request, Response } from "express";
import expressSession from "express-session";
import Keycloak from "keycloak-connect";
import { KeycloakAuth, ExtendedKeycloakConfig, ExtendedToken } from "./types";
import { createServer } from "http";

import ora from "ora";

import open from "open";

const defaultKCConfig: ExtendedKeycloakConfig = {
    "realm": "quorum",
    "auth-server-url": "https://quorum-auth.quorum.consensys.net/auth/",
    "ssl-required": "external",
    "resource": "quorum-dev-quickstart",
    "public-client": true,
    "confidential-port": 0
  };

export { ExtendedToken } from "./types";

export async function getAccessToken(kcConfig: ExtendedKeycloakConfig = defaultKCConfig): Promise<ExtendedToken> {
    const app = express();

    const store = new expressSession.MemoryStore();
    const session = expressSession({
        secret: 'some secret',
        resave: false,
        saveUninitialized: true,
        store
    });
    app.use(session);

    const keycloak = new Keycloak({ store, scope: "offline_access" }, kcConfig);
    app.use(keycloak.middleware());

    const tokenPromise = new Promise<ExtendedToken>((resolve, reject) => {
        app.get(
            "/authenticate",
            keycloak.protect("realm:quorum_user_role"),
            (req: Request, res: Response) => {
                try {
                    // Breaking things out to vars here to make debugging
                    // easier. Also this type casting is ugly, but it makes the
                    // TS compiler happy. There's probably a better way, though.
                    res.setHeader("Connection", "close");
                    res.send("Authentication succeeded. Please close this window and return to your terminal to proceed.");
                    res.end();
                    resolve((req as unknown as KeycloakAuth).kauth.grant.access_token);
                } catch (err) {
                    reject(err);
                }
            }
        );
    });

    const server = createServer(app);
    server.listen(53098, "0.0.0.0");

    const spinner = ora("Opening login page. Please click the 'Register' link if you don't have an account.").start();
    await _delay(2000);

    try {
        const subprocess = await open("http://localhost:53098/authenticate");
        subprocess.unref();
    } catch {
        console.log("Couldn't open browser window. Please visit http://localhost:53098/authenticate in your browser to continue.");
    }

    spinner.text = "Waiting for successful login";
    const result = await tokenPromise;
    server.close();
    spinner.text = "Authentication successful!";
    await _delay(2000);
    spinner.succeed("Authentication successful!");
    return result;
}

async function _delay(delayMs: number): Promise<void> {
    return new Promise ((resolve) => {
        setTimeout(resolve, delayMs);
    });
}

// for test purposes
if (require.main === module) {
    void(async () => {
        const result = await getAccessToken();
        console.log(JSON.stringify(result, null, 2));
    })();
}