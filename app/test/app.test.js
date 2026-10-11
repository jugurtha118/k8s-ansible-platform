const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { createApp } = require("../src/app");

function start() {
  return new Promise((resolve) => {
    const server = createApp().listen(0, () => resolve(server));
  });
}

function get(server, path) {
  return new Promise((resolve, reject) => {
    http
      .get({ port: server.address().port, path }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

test("GET /health renvoie 200 et status ok", async () => {
  const server = await start();
  const res = await get(server, "/health");
  server.close();
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(JSON.parse(res.body), { status: "ok" });
});

test("GET /api/info renvoie les métadonnées de version", async () => {
  const server = await start();
  const res = await get(server, "/api/info");
  server.close();
  const data = JSON.parse(res.body);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.name, "azure-cloud-platform");
  assert.ok("version" in data && "commit" in data);
});

test("GET /api/fail renvoie 500 (test d'alerte)", async () => {
  const server = await start();
  const res = await get(server, "/api/fail");
  server.close();
  assert.strictEqual(res.status, 500);
});

test("route inconnue renvoie 404", async () => {
  const server = await start();
  const res = await get(server, "/nimportequoi");
  server.close();
  assert.strictEqual(res.status, 404);
});
