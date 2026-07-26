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
  /**
   * Called once when a request gets a 401. Should refresh the session (single-flight
   * upstream) and resolve with a fresh access token, or null if refresh failed. When a
   * token is returned the original request is retried once with it.
   */
  onUnauthorized?: () => Promise<string | null>;
}

export function createBuslaClient({
  baseUrl,
  getToken,
  onUnauthorized,
}: BuslaClientOptions): BuslaClient {
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

  if (onUnauthorized) {
    // Guard against retry loops: a retried request is never itself retried.
    const retried = new WeakSet<Request>();
    client.use({
      async onResponse({ request, response }) {
        if (response.status !== 401 || retried.has(request)) return response;

        const token = await onUnauthorized();
        if (!token) return response;

        try {
          // clone() must run before the body is consumed; safe for the GETs used today.
          const retry = request.clone();
          retry.headers.set("Authorization", `Bearer ${token}`);
          retried.add(retry);
          return await fetch(retry);
        } catch {
          return response;
        }
      },
    });
  }

  return client;
}
