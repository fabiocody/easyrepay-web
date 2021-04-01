import * as dotenv from 'dotenv';
const pg = require('pg');

dotenv.config();
pg.defaults.ssl = true;

const knexConfig = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./test-db.sqlite3"
        },
        useNullAsDefault: true,
        migrations: {
            directory: __dirname + '/database/migrations',
        },
    },

    production: {
        client: "postgresql",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {rejectUnauthorized: false}
        },
        useNullAsDefault: true,
        migrations: {
            directory: __dirname + '/database/migrations',
        },
    }
};

export default knexConfig;
module.exports = knexConfig;
