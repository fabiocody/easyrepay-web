import {Request, Response, NextFunction, Application} from 'express';
import {AbstractController} from "./abstract-controller";
import {TestDao} from "../model/dao/test-dao";


export class TestController implements AbstractController {
    private readonly testDao = new TestDao();

    public setupRoutes(app: Application) {
        app.route('/')
            .get(TestController.root);
        app.route('/test')
            .get(this.test.bind(this));
    }

    private static root(req: Request, res: Response, next: NextFunction): void {
        res.send('<h1>Hello, world</h1>')
    }

    private test(req: Request, res: Response, next: NextFunction): void {
        this.testDao.getAll().then(data => res.json(data));
    }
}
