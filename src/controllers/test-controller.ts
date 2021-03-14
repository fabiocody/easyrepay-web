import {Request, Response, NextFunction} from 'express';
import {AbstractController} from "./abstract-controller";
import {TestDao} from "../model/dao/test-dao";

const testDao = new TestDao();

export class TestController implements AbstractController {
    public handle(req: Request, res: Response, next: NextFunction): void {
        testDao.getAll().then(data => res.json(data));
    }
}
