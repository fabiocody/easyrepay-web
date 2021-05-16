import express from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import 'reflect-metadata';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {AuthController} from './controllers/auth.controller';
import {UserController} from './controllers/user.controller';
import {PersonController} from './controllers/person.controller';
import {TransactionController} from './controllers/transaction.controller';
import {AuthService} from './services/auth.service';
import {Action, useExpressServer} from 'routing-controllers';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

/* MIDDLEWARES */
app.use(morgan('[:method] :url (:status) - :res[content-length] B - :response-time ms'));
app.use(cors());
app.use(rateLimit({windowMs: 1000, max: 300}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(path.join(__dirname, '../api/swagger.yaml'))));

/* SETUP SERVER WITH API ROUTES AND AUTHENTICATION */
useExpressServer(app, {
    routePrefix: '/api',
    development: process.env.NODE_ENV ? process.env.NODE_ENV === 'development' : true,
    defaults: {undefinedResultCode: 204},
    controllers: [AuthController, PersonController, UserController, TransactionController],
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
