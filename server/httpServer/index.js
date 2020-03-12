const express = require("express");
const path = require("path");
const config = require("../config");
const log = require("../logger").log;
const session = require('../core/session');

module.exports = {
  init: () => {
    var app = express();
    try {
      var public = path.join(process.cwd(), config.publicPath || "/ui/");
      app.use(staticMiddleware, express.static(path.resolve(public)));
      app.listen(config.httpServer.port, () => {
        log({message: 'The http server is listening on :' + config.httpServer.port});
      });
    } catch (e) {
      log(e);
    }
    app.post("/rpc", (req, res) => {
      return res.status(200).json({ status: "ok" });
    });
  }
};

var staticMiddleware = async function(req, res, next) {
  try {
    if ((req.path.endsWith('.html') || req.path.endsWith('/') ) && req.headers.cookie) {
      var jwtToken = getCookie('jwtToken', req.headers.cookie);
      var sessionValid = await session.verify(jwtToken);
    }
    next();
  } catch(e) {
    res.sendFile(path.join(process.cwd(), '/ui/pages/login/index.html'));
  }
};

function getCookie(name, cookie){
  if (name && cookie) {
    var pattern = RegExp(name + "=.[^;]*")
    var matched = cookie.match(pattern)
    if(matched){
        var cookie = matched[0].split('=')
        return cookie[1]
    }
  }
  return false
}
