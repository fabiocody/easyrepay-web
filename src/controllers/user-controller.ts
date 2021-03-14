import {AbstractController} from "./abstract-controller";
import {Application, NextFunction, Request, Response} from "express";
import {UserDao} from "../model/dao/user-dao";

export class UserController implements AbstractController {
    private userDao = new UserDao();

    setupRoutes(app: Application): void {
        app.route('/users')
            .get(this.getAllUsers.bind(this));
    }

    private getAllUsers(req: Request, res: Response, next: NextFunction): void {
        this.userDao.getAll().then(data => res.json(data));
    }
}
