const express = require("express");
const path = require("path");
const config = require("../config");
const log = require("../logger");

module.exports = {
  init: () => {
    var app = express();
    try {
      var public = path.join(process.cwd(), config.publicPath || "/ui/");
      app.use(express.static(path.resolve(public)));
      app.use(log.logger());
      app.listen(config.httpServer.port, () => {});
    } catch (e) {
      console.error(e);
    }
    app.post("/rpc", (req, res) => {
      return res.status(200).json({ status: "ok" });
    });
  }
};
