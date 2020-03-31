var wssConnections = {};
const session = require('../core/session');

module.exports = {
    add: function(token, ws) {
        wssConnections[token] = ws;
    },
    sendMessage: function(token, msg) {
        try {
            var sessionValid = await session.verify(token);
            if (sessionValid) {
                wssConnections[token].send(JSON.stringify(msg, null, 4));
            }
        } catch(e) {
            throw new Error('Token is not valid!');
        }
    }
};
