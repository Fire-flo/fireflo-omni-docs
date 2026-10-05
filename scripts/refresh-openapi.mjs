/**
 * Save the API's published description as api-reference/openapi.json for the Try-it
 * reference: fetched from a development API (OMNI_API_URL, http://localhost:8200 by
 * default), with the public server address and the key-based sign-in added.
 */

import { writeFileSync } from "node:fs";

const base = process.env.OMNI_API_URL ?? "http://localhost:8200";
const response = await fetch(`${base}/v1/openapi.json?format=json`, {
  headers: { Accept: "application/vnd.oai.openapi+json" },
});
if (!response.ok) throw new Error(`The API answered ${response.status}`);
const schema = await response.json();

schema.servers = [{ url: "https://api.fireflo.au", description: "FireFlo OMNI" }];
schema.components = {
  ...schema.components,
  securitySchemes: {
    bearer: { type: "http", scheme: "bearer", description: "An OMNI API key: ff_live_… or ff_test_…" },
  },
};
schema.security = [{ bearer: [] }];
for (const methods of Object.values(schema.paths)) {
  for (const operation of Object.values(methods)) operation.security = [{ bearer: [] }];
}

writeFileSync(new URL("../api-reference/openapi.json", import.meta.url), `${JSON.stringify(schema, null, 2)}\n`);
const count = Object.values(schema.paths).reduce((sum, methods) => sum + Object.keys(methods).length, 0);
console.log(`Saved ${count} operations.`);
