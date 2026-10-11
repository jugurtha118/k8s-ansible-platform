const { createApp } = require("./app");

const port = process.env.PORT || 8080;
const app = createApp();

const server = app.listen(port, () => {
  console.log(JSON.stringify({ level: "info", msg: "server started", port }));
});

// Arrêt propre (App Service envoie SIGTERM lors d'un redémarrage ou d'un swap)
process.on("SIGTERM", () => {
  console.log(JSON.stringify({ level: "info", msg: "SIGTERM reçu, arrêt" }));
  server.close(() => process.exit(0));
});
