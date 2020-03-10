const env = process.env.NODE_ENV;
module.exports = {
    httpServer: {
        port: process.env.HTTP_SERVER_PORT
    },
    database: {
        credentials: {
            username: process.env.DB_CRED_USERNAME,
            password: process.env.DB_CRED_USERNAME
        },
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
};
