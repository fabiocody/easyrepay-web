import {AbstractController} from "./abstract-controller";
import {Application, NextFunction, Request, Response} from "express";
import {UserDao} from "../model/dao/user-dao";
import {UserService} from "../services/user-service";

export class UserController implements AbstractController {
    private userDao = new UserDao();
    private userService = new UserService();

    setupRoutes(app: Application): void {
        app.route('/api/users')
            .get(this.getAllUsers.bind(this));
        app.route('/api/login')
            .post(this.login.bind(this));
    }

    private getAllUsers(req: Request, res: Response, next: NextFunction): void {
        this.userDao.getAll().then(data => res.json(data));
    }

    private login(req: Request, res: Response, next: NextFunction): void {
        const authHeader: string | undefined = req.headers.authorization;
        if (authHeader) {
            const credentials: string = authHeader.split(' ')[1];
            this.userService.login(credentials)
                .then(loginDto => res.json(loginDto))
                .catch(_ => res.sendStatus(403));
        } else {
            res.sendStatus(400);
        }
    }
}
