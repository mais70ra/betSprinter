const express = require('express');
const path = require('path');
const config = require('./config');
const log = require("./logger");
let app = express();

try {
    var public = path.join(
        process.cwd(),
        config.publicPath || '/ui/'
    );
    app.get('/', function(req, res) {
        res.sendFile(path.join(public + 'index.html'));
    });
    app.use(express.static(path.resolve(public)));
    app.use(log.logger());
    app.listen(config.httpServer.port || 3000);
} catch(e) {
    console.error(e); 
}
app.post("/rpc", (req, res) => {
    return res.status(200).json({ status: 'ok' });
});
