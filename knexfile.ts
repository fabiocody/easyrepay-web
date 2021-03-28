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
            database: "my_db",
            user: "username",
            password: "password"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: __dirname + '/database/migrations',
        },
    }
};

export default knexConfig;
module.exports = knexConfig;
