const env = process.env.NODE_ENV;
module.exports = {
    jwt: {
        cert: 'secret'
    },
    webSocketServer: {
        port: process.env.WEB_SOCKET_SERVER_PORT || 40510
    },
    httpServer: {
        port: process.env.HTTP_SERVER_PORT || 3000
    },
    database: {
        credentials: {
            username: process.env.DB_CRED_USERNAME || 'admin',
            password: process.env.DB_CRED_PASSWORD || 'admin'
        },
        props: {
			dialect: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || '5432',
			define: {
				'freezeTableName': true
			}
		},
        name: process.env.DB_NAME || 'betSprinter'
    }
};
