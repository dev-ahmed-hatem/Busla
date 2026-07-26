/**
 * Typed BUSLA API client. Thin wrapper over openapi-fetch bound to the generated
 * OpenAPI schema. The web app imports `createBuslaClient` and gets fully-typed
 * paths/params/responses; a JWT provider injects the bearer token per request.
 */
import createClient, { type Client } from "openapi-fetch";

import type { paths } from "./generated/schema.js";

export type { paths, components } from "./generated/schema.js";
export type BuslaClient = Client<paths>;

export interface BuslaClientOptions {
  baseUrl: string;
  /** Returns the current access token (or null when unauthenticated). */
  getToken?: () => string | null | undefined;
}

export function createBuslaClient({ baseUrl, getToken }: BuslaClientOptions): BuslaClient {
  const client = createClient<paths>({ baseUrl });

  if (getToken) {
    client.use({
      onRequest({ request }) {
        const token = getToken();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
        return request;
      },
    });
  }

  return client;
}
