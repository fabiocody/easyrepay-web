import {join} from 'path';

export class Config {
    public readonly angularPath = join(__dirname, 'angular');
    public readonly swaggerFiles = ['../api/swagger.yaml', 'api/swagger.yaml'].map(p => join(__dirname, p));
}

const config = new Config();
export {config};
