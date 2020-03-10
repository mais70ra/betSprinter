const WebSocketServer = require("ws").Server;
const config = require("../config");
module.exports = {
  init: () => {
    var wss = new WebSocketServer({ port: config.webSocketServer.port });
    wss.on("connection", function(ws) {
      ws.on("message", function(message) {
        console.log("received: %s", message);
      });
      //   setInterval(() => {
      //     ws.send(`${new Date()}`);
      //   }, 10000);
    });
  }
};
