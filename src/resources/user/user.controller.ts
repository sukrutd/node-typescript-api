import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import isAuthenticated from '@/middleware/authentication.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';

class UserController implements Controller {
    public path = '/users';
    public router = Router();

    private userService;

    constructor() {
        this.initializeRoutes();
        this.userService = new UserService();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);

        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);

        this.router.get(`${this.path}/me`, isAuthenticated, this.getUser);
    }

    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const token = await this.userService.register(name, email, password, 'user');
            return res.status(201).json({ token });
        } catch (err) {
            if (err instanceof Error) {
                return next(new HttpException(400, err.message));
            } else {
                throw err;
            }
        }
    };

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            return res.status(200).json({ token });
        } catch (err) {
            if (err instanceof Error) {
                return next(new HttpException(400, err.message));
            } else {
                throw err;
            }
        }
    };

    private getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged-in user found.'));
        }

        return res.status(200).json({ user: req.user });
    };
}

export default UserController;
