var wssConnections = {};
const session = require('../core/session');

module.exports = {
    add: function(token, ws) {
        wssConnections[token] = ws;
    },
    sendMessage: async function(token, msg) {
        try {
            var sessionValid = await session.verify(token);
            if (sessionValid) {
                return wssConnections[token].send(JSON.stringify(msg, null, 4));
            } else {
                throw new Error('No active session!');
            }
        } catch(e) {
            throw new Error('Token is not valid!');
        }
    }
};
