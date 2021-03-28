import Knex from 'knex';
import knexConfig from "../../knexfile";

const environment: string = process.env.NODE_ENV || 'development';
console.log(`ENVIRONMENT=${environment}`);
const config = knexConfig[environment];
export const db = Knex(config);
