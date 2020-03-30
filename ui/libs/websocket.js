var webSocket;
var reqWSC = function() {
    popup.error('There is a problem with the connection, please try again latter');
};

function webSocketConnect(onReceive, onError) {
    return new Promise(function(resolve, reject) {
        if (webSocket) {
            resolve();
        }
        try {
            // if user is running mozilla then use it's built-in WebSocket
            window.WebSocket = window.WebSocket || window.MozWebSocket;
            
            webSocket = new WebSocket("ws://127.0.0.1:40510");

            webSocket.onopen = function() {
                console.log('websocket is connected ...')
                resolve();
            };
            // webSocket.send('oooooooooo'); // invalid json
            // webSocket.send('{id: 1}'); // invalid json
            // webSocket.send('{"id": 1}'); // valid json
            // webSocket.send('{"id": 1, method: "user.add"}'); // invalid json
            // webSocket.send('{"id": 1, "method": "user.add"}'); // invalid json
            // setInterval(() => {
            //     webSocket.send('{"id": 1, "method": "user.add"}'); // valid json
            // }, 1000);
            
            webSocket.onerror = function(error) {
                console.log(error);
                // an error occurred when sending/receiving data
            };
            
            webSocket.onmessage = function(message) {
                // try to decode json (I assume that each message
                // from server is json)
                try {
                    var body = JSON.parse(message.data);
                    if (body.id) {
                        if (reqQueue[body.id]) {
                            reqQueue[body.id](body);
                        } else {
                            console.log('This request was timeout!');
                        }
                    } else if(body.event) {
                        if (eventHandler[body.event]) {
                            eventHandler[body.event](body.params);
                        } else {
                            console.log('There is not event handler for this event ' + body.event);
                        }
                    }
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
var reqQueue = {};

webSocketConnect().then(r => {
    reqWSC = function(method, params) {
        return new Promise(function(resolve, reject) {
            let id = makeid()
            let req = {
                id,
                method,
                params,
                headers: {
                    jwtToken: getCookie('jwtToken')
                }
            };
            var timeout = setTimeout(function(){ 
                delete reqQueue[id];
                let err = new Error('Timeout');
                popup.error('Timeout from the server');
                reject(err);
            }, 30000);
            reqQueue[id] = function(body) {
                clearTimeout(timeout);
                if (body.result) {
                    resolve(body);
                } else if (body.error) {
                    reject(body.error);
                } else {
                    reject(body);
                }
                delete reqQueue[id];
            }
            webSocket.send(JSON.stringify(req));
        });
    }

    reqWSC('user.check', {})
    .then(r => {
        document.getElementById('name').innerHTML = r.result.name;
        document.getElementById('balance').innerHTML = r.result.balance;
    })
    .catch(e => {

    });
});

function makeid(length) {
    length = length || 15;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }