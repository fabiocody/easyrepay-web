import Knex from 'knex';
import knexConfig from "../knexfile";

const environment: string = process.env.ENVIRONMENT || 'development';
const config = knexConfig[environment];
export const knex = Knex(config);
