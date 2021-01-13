const app = require('express')();

app.get('/', (_req, res) => {
  res.status(200).send();
});

module.exports = app;