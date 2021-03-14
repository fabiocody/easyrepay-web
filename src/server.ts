import express from 'express';
import dotenv from 'dotenv';
import {TestController} from "./controllers/test-controller";
import {UserController} from "./controllers/user-controller";
import {AuthMiddleware} from "./middlewares/auth-middleware";
import {unless} from "./middlewares/unless-middleware";


/** SERVER PARAMETERS **/
dotenv.config();
const app = express();
const hostname = '0.0.0.0';
const port: number = parseInt(process.env.PORT ||  '8080', 10);


/** ROUTING **/
new TestController().setupRoutes(app);
new UserController().setupRoutes(app);


/** MIDDLEWARES **/
app.use(unless(['/login'], AuthMiddleware.authenticateRequest))


/** START SERVER **/
app.listen(port, hostname, () => {
    console.log(`Server is listening on http://${hostname}:${port}`)
});
