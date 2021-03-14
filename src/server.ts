import express from 'express';
import {TestController} from "./controllers/test-controller";


/** SERVER PARAMETERS **/
const app = express();
const hostname = '0.0.0.0';
const port: number = /*parseInt(process.env.PORT, 10) ||*/ 8080;


/** ROUTING **/
app.route('/').get(new TestController().handle);


/** START SERVER **/
app.listen(port, hostname, () => {
    console.log(`Server is listening on http://${hostname}:${port}`)
})
