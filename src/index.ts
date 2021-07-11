import express from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import morgan from 'morgan';
import 'reflect-metadata';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import {AuthController} from './controllers/auth.controller';
import {UserController} from './controllers/user.controller';
import {PersonController} from './controllers/person.controller';
import {TransactionController} from './controllers/transaction.controller';
import {UtilsController} from './controllers/utils.controller';
import {AuthService} from './services/auth.service';
import {Action, useExpressServer} from 'routing-controllers';
import {createConnection} from 'typeorm';

dotenv.config();
const dev = process.env.NODE_ENV ? process.env.NODE_ENV === 'development' : true;

createConnection()
    .then(_ => console.log('DB connection created'))
    .catch(err => console.error('Error while establishing DB connection:', err));

if (process.env.RELEASE_INFO) {
    console.log(process.env.RELEASE_INFO);
}

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
    'https://easyrepay.fabiocodiglioni.ovh',
    'easyrepay.fabiocodiglioni.ovh',
];

/* MIDDLEWARES */
// @ts-ignore
app.use(morgan('tiny'));
// @ts-ignore
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ['\'self\'', '\'unsafe-inline\''],
            scriptSrcAttr: ['\'self\'', '\'unsafe-inline\''],
        }
    }
}));
app.use((req, _, next) => {
    req.headers.origin = req.headers.origin ?? req.headers.host;
    next();
});
app.use(cors({
    origin: (origin, callback) => {
        if (dev || !origin) {
            console.log('CORS: dev or no origin');
            callback(null);
        } else if (origin && allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error(`Origin ${origin} not allowed`));
        }
    },
    optionsSuccessStatus: 200,
}));
app.use(rateLimit({windowMs: 1000, max: 50}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(path.join(__dirname, '../api/swagger.yaml'))));

/* SETUP SERVER WITH API ROUTES AND AUTHENTICATION */
useExpressServer(app, {
    routePrefix: '/api',
    development: dev,
    defaults: {undefinedResultCode: 204},
    controllers: [AuthController, PersonController, UserController, TransactionController, UtilsController],
    authorizationChecker: async (action: Action, _: string[]) => {
        const headers = action.request.headers;
        return AuthService.authorizationChecker(headers);
    },
    currentUserChecker: async (action: Action) => {
        const headers = action.request.headers;
        return AuthService.currentUserChecker(headers);
    }
});

/* SERVE ANGULAR APP */
const angularPath = path.join(__dirname, '../angular');
const angularIndexPath = path.resolve(angularPath, 'index.html');
if (fs.existsSync(angularIndexPath)) {
    console.log('Serving Angular app');
    app.use('/', express.static(angularPath));
    app.all('/*', (_, res) => res.sendFile(angularIndexPath));
} else {
    console.log('Skipping Angular app');
}

/* START SERVER */
const port: number = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => console.log(`Listening on port ${port}`));
