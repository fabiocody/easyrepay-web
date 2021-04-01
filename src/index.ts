import express from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import 'reflect-metadata';
import morgan from 'morgan';
import passport from 'passport';
import './config/passport';
import {AuthController} from './controllers/auth.controller';
import {UserController} from './controllers/user.controller';
import {PersonController} from './controllers/person.controller';
import {TransactionController} from './controllers/transaction.controller';

dotenv.config();

const app = express();

/* MIDDLEWARES */
app.use(morgan('[:method] :url (:status) - :res[content-length] B - :response-time ms'));
app.use(cors());
app.use(helmet());
app.use(express.json());

/* SERVE ANGULAR APP */
const angularPath = path.join(__dirname, '../angular');
const angularIndexPath = path.resolve(angularPath, 'index.html');
if (fs.existsSync(path.resolve(angularPath, 'index.html'))) {
    console.log('Serving Angular app');
    app.use('/', express.static(angularPath));
    app.all('/*', (_, res) => res.sendFile(angularIndexPath));
} else {
    console.log('Skipping Angular app');
}

/* SETUP AUTHENTICATION */
const jwtAuthentication = passport.authenticate('jwt', {session: false});
const basicAuthentication = passport.authenticate('basic', {session: false});

/* API ROUTES */
app.route('/api/auth/authenticate')
    .post(basicAuthentication, AuthController.authenticate);
app.route('/api/auth/refresh-token')
    .post(AuthController.refreshToken);
app.route('/api/me')
    .get(jwtAuthentication, UserController.getMe);
app.route('/api/people')
    .get(jwtAuthentication, PersonController.getPeople)
    .post(jwtAuthentication, PersonController.savePerson);
app.route('/api/person/:id')
    .get(jwtAuthentication, PersonController.getPerson)
    .delete(jwtAuthentication, PersonController.deletePerson);
app.route('/api/person/:id/transactions')
    .get(jwtAuthentication, TransactionController.getTransactions)
    .delete(jwtAuthentication, TransactionController.deleteAllTransactions);
app.route('/api/person/:id/transactions/complete')
    .post(jwtAuthentication, TransactionController.setCompleted)
    .delete(jwtAuthentication, TransactionController.deleteCompleted);
app.route('/api/transactions')
    .post(jwtAuthentication, TransactionController.saveTransaction);
app.route('/api/transaction/:id')
    .delete(jwtAuthentication, TransactionController.deleteTransaction);

/* START SERVER */
const port: number = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => console.log(`Listening on port ${port}`));
