const env = process.env.NODE_ENV;
module.exports = {
    webSocketServer: {
        port: process.env.WEB_SOCKET_SERVER_PORT || 40510
    },
    httpServer: {
        port: process.env.HTTP_SERVER_PORT || 3000
    },
    database: {
        credentials: {
            username: process.env.DB_CRED_USERNAME || 'admin',
            password: process.env.DB_CRED_USERNAME || 'admin'
        },
        name: process.env.DB_NAME || 'betSprinter',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432'
    }
};
