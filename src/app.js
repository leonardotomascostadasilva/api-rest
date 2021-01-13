const app = require("express")();
const consign = require("consign");
const knex = require("knex");
const knexFile = require("../knexfile");
const knexLogger = require("knex-logger");

// TODO criar chaveamento dinamico
app.db = knex(knexFile.test);

// app.use(knexLogger(app.db));

consign({ cwd: "src", verbose: false })
  .include("./config/middlewares.js")
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.get("/", (_req, res) => {
  res.status(200).send();
});

module.exports = app;