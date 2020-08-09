import { KeycloakConfig, Token } from "keycloak-connect";

export interface KeycloakAuth {
    kauth: {
        grant: {
            access_token: ExtendedToken; // eslint-disable-line camelcase
        };
    };
}

export type ExtendedKeycloakConfig = KeycloakConfig & {
    // eslint-disable-next-line camelcase
    "public-client"?: boolean;
    // eslint-disable-next-line camelcase
    "verify-token-audience"?: boolean;
    // eslint-disable-next-line camelcase
    "use-resource-role-mappings"?: boolean;
};

export type ExtendedToken = Token & {
    token?: string;
    signed?: string;
    content: {
        "exp": number;
        "iat": number;
        "auth_time": number;
        "jti": string;
        "iss": string;
        "aud": string;
        "sub": string;
        "typ": string;
        "azp": string;
        "session_state": string;
        "acr": string;
        "allowed-origins": string[];
        "realm_access": {
          "roles": string[];
        };
        "resource_access": {
          [index: string]: {
            "roles": string[];
          };
        };
        "scope": string;
        "email_verified": boolean;
        "name": string;
        "preferred_username": string;
        "given_name": string;
        "family_name": string;
        "email": string;
      };
};
