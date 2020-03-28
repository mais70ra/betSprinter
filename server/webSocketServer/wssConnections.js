var wssConnections = {};
module.exports = {
    add: function(token, ws) {
        wssConnections[token] = ws;
    },
    sendMessage: function(token, msg) {
        wssConnections[token].send(JSON.stringify(msg, null, 4));
    }
};
