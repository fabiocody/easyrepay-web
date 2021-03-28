import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import 'reflect-metadata';
import morgan from 'morgan';
import passport from "passport";
import cookieParser from 'cookie-parser';
import {AuthController} from "./controllers/auth.controller";
import './config/passport';
import {UserController} from "./controllers/user.controller";
import {PersonController} from "./controllers/person.controller";
import {TransactionController} from "./controllers/transaction.controller";

dotenv.config();

const app = express();

/** MIDDLEWARES **/
app.use(morgan('[:method] :url (:status) - :res[content-length] B - :response-time ms'));
app.use(passport.initialize());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

/** SETUP AUTHENTICATION **/
const jwtAuthentication = passport.authenticate('jwt', {session: false});
const basicAuthentication = passport.authenticate('basic', {session: false});

/** ROUTES **/
app.route('/api/auth/authenticate')
    .post(basicAuthentication, AuthController.authenticate);
app.route('/api/auth/refresh-token')
    .post(AuthController.refreshToken);
app.route('/api/me')
    .get(jwtAuthentication, UserController.getMe);
app.route('/api/people')
    .get(jwtAuthentication, PersonController.getPeople)
    .post(jwtAuthentication, PersonController.addPerson);
app.route('/api/person/:id')
    .get(jwtAuthentication, PersonController.getPerson)
    .post(jwtAuthentication, PersonController.updatePerson)
    .delete(jwtAuthentication, PersonController.deletePerson);
app.route('/api/person/:id/transactions')
    .get(jwtAuthentication, TransactionController.getTransactions)
    .post(jwtAuthentication, TransactionController.addOrUpdateTransaction)
    .delete(jwtAuthentication, TransactionController.deleteAllTransactions);
app.route('/api/person/:id/transactions/complete')
    .post(jwtAuthentication, TransactionController.setCompleted)
    .delete(jwtAuthentication, TransactionController.deleteCompleted)
app.route('/api/transaction/:id')
    .delete(jwtAuthentication, TransactionController.deleteTransaction);

/** START SERVER **/
const hostname = '0.0.0.0';
const port: number = parseInt(process.env.PORT ||  '3000', 10);
app.listen(port, hostname, () => console.log(`Listening on http://${hostname}:${port}`))
