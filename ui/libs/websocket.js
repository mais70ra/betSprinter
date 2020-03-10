var webSocket;

function webSocketConnect(onReceive, onError) {
    return new Promise(function(resolve, reject) {
        if (webSocket) {
            resolve(webSocket);
        }
        try {
            // if user is running mozilla then use it's built-in WebSocket
            window.WebSocket = window.WebSocket || window.MozWebSocket;
            
            webSocket = new WebSocket("ws://127.0.0.1:40510");

            webSocket.onopen = function() {
                console.log('websocket is connected ...')
                webSocket.send('connected');
                resolve(webSocket);
            };
            // webSocket.send('oooooooooo'); // invalid json
            // webSocket.send('{id: 1}'); // invalid json
            // webSocket.send('{"id": 1}'); // valid json
            // webSocket.send('{"id": 1, method: "user.add"}'); // invalid json
            // webSocket.send('{"id": 1, "method": "user.add"}'); // invalid json
            setInterval(() => {
                webSocket.send('{"id": 1, "method": "user.add"}'); // invalid json
            }, 1000);
            
            webSocket.onerror = function(error) {
                console.log(error);
                // an error occurred when sending/receiving data
            };
            
            webSocket.onmessage = function(message) {
                // try to decode json (I assume that each message
                // from server is json)
                try {
                    var json = JSON.parse(message.data);
                    console.log(json);
                } catch (e) {
                    console.log("This doesn't look like a valid JSON: ", message.data);
                    return;
                }
                // handle incoming message
            };
        } catch (e) {
            reject(e);
        }
    });
}
