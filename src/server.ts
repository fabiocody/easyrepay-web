import express from 'express';
import dotenv from 'dotenv';
import {UserController} from "./controllers/user-controller";
import {AuthMiddleware} from "./middlewares/auth-middleware";
import {unless} from "./middlewares/unless-middleware";


/** SERVER PARAMETERS **/
dotenv.config();
const app = express();
const hostname = '0.0.0.0';
const port: number = parseInt(process.env.PORT ||  '8080', 10);


/** MIDDLEWARES **/
app.use(unless(['/api/login'], AuthMiddleware.authenticateRequest));


/** ROUTING **/
new UserController().setupRoutes(app);


/** START SERVER **/
app.listen(port, hostname, () => {
    console.log(`Server is listening on http://${hostname}:${port}`)
});
