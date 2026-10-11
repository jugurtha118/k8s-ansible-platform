const express = require("express");
const path = require("path");

const startedAt = new Date();

function createApp() {
  const app = express();
  app.disable("x-powered-by");

  // Journal structuré : une ligne JSON par requête (facile à interroger en KQL dans Log Analytics)
  app.use((req, res, next) => {
    const t0 = process.hrtime.bigint();
    res.on("finish", () => {
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      console.log(
        JSON.stringify({
          level: "info",
          msg: "request",
          method: req.method,
          path: req.path,
          status: res.statusCode,
          durationMs: Math.round(ms * 10) / 10,
        })
      );
    });
    next();
  });

  app.use(express.static(path.join(__dirname, "..", "public")));

  // Sonde de santé : utilisée par App Service (health check) et par les alertes
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Informations de version : permet de vérifier quel déploiement tourne
  app.get("/api/info", (_req, res) => {
    res.json({
      name: "azure-cloud-platform",
      version: process.env.APP_VERSION || "dev",
      environment: process.env.APP_ENV || "local",
      commit: process.env.GIT_SHA || "unknown",
      startedAt: startedAt.toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      node: process.version,
    });
  });

  // Endpoint de test d'incident : provoque volontairement une erreur 500
  // (pour déclencher l'alerte et s'entraîner au diagnostic)
  app.get("/api/fail", (_req, res) => {
    console.error(JSON.stringify({ level: "error", msg: "erreur volontaire /api/fail" }));
    res.status(500).json({ error: "erreur volontaire pour tester les alertes" });
  });

  app.use((_req, res) => res.status(404).json({ error: "not found" }));

  return app;
}

module.exports = { createApp };
