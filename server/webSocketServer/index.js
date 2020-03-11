const WebSocketServer = require("ws").Server;
const config = require("../config");
const core = require("../core");
const log = require("../logger").log;
module.exports = {
  init: () => {
    var wss = new WebSocketServer({ port: config.webSocketServer.port });
    wss.on("connection", function(ws) {
      ws.on("message", function(message) {
        log("received: %s", message);
        try {
          var msg = JSON.parse(message);
        } catch (e) {
          let response = {
            error: {
              code: 9999,
              message: "This doesn't look like a valid JSON",
              requestBody: message
            }
          };
          log(response);
          ws.send(JSON.stringify(response));
          return;
        }
        try {
          if (msg.id) {
            if (msg.method && typeof msg.method === "string") {
              core
                .call(msg.method, msg.params)
                .then(res => {
                  let response = {
                    id: msg.id,
                    result: res
                  };
                  log(response);
                  ws.send(JSON.stringify(response));
                })
                .catch(e => {
                  let response = {
                    id: msg.id,
                    error: {
                      code: e.code,
                      message: e.message,
                      stack: e.stack
                    }
                  };
                  log(response);
                  ws.send(JSON.stringify(response));
                });
            } else {
              let response = {
                id: msg.id,
                error: {
                  code: 9997,
                  message:
                    "There is no method or it's invalid method in the request: ",
                  requestBody: msg
                }
              };
              log(response);
              ws.send(JSON.stringify(response));
              return;
            }
          } else {
            let response = {
              error: {
                code: 9998,
                message: "There is no id in the request: ",
                requestBody: msg
              }
            };
            log(response);
            ws.send(JSON.stringify(response));
            return;
          }
        } catch (e) {
          log("Response: ", e);
          ws.send(`${e}`);
        }
      });
      // setInterval(() => {
      //   ws.send(`${Date.now()}`);
      // }, 10000);
    });
  }
};
