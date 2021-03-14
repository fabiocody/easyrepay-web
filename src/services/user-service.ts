import {UserDao} from "../model/dao/user-dao";
import {UserModel} from "../model/user-model";
import {AuthMiddleware} from "../middlewares/auth-middleware";
import {LoginDto} from "../model/dto/login-dto";

export class UserService {
    private userDao = new UserDao();

    private validateCredentials(credentials: string): Promise<UserModel> {
        const buff = Buffer.from(credentials, 'base64');
        const decoded = buff.toString('utf-8');
        const username = decoded.split(':')[0];
        const password = decoded.split(':')[1];
        return this.userDao.getFromUserPass(username, password);
    }

    public login(credentials: string): Promise<LoginDto> {
        return new Promise<LoginDto>(async (resolve, reject) => {
            this.validateCredentials(credentials).then(user => {
                const token = AuthMiddleware.generateToken(credentials);
                resolve({
                    userId: user.id as number,
                    token: token,
                });
            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }
}
