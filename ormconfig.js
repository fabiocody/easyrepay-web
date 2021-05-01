const dotenv = require('dotenv');

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`ENVIRONMENT=${environment}`);

const configs = {
    development: {
        name: 'default',
        type: 'sqlite',
        database: './test-db-type.sqlite3',
        synchronize: true,
        entities: [__dirname + '/src/model/*.ts'],
        // migrations: [__dirname + '../database/migrations/*{.js,.ts}'],
    },
    production: {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        entities: [__dirname + '/src/model/*.js'],
        // migrations: [__dirname + '../database/migrations/*{.js,.ts}'],
    }
}

module.exports = configs[environment];
