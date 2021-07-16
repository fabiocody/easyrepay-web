import {Logger, Module} from '@nestjs/common';
import {createConnection} from 'typeorm';
import {config as dotenvConfig} from 'dotenv';
import {join} from 'path';

dotenvConfig();
const environment = process.env.NODE_ENV || 'development';
const logger = new Logger('DatabaseModule');
logger.log(environment);

const configs = {
    development: {
        name: 'default',
        type: 'sqlite',
        database: './test-db.sqlite3',
        synchronize: true,
        entities: [join(__dirname, '../model/entities/*.entity{.ts,.js}')],
    },
    production: {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        entities: [join(__dirname, '../model/entities/*.entity{.ts,.js}')],
    },
};

const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            try {
                const connection = await createConnection(configs[environment]);
                logger.log('Connection created');
                return connection;
            } catch (error) {
                logger.error('Failed to create connection');
                logger.error(error);
                throw error;
            }
        },
    },
];

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
