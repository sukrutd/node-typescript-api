import { Request, Response, NextFunction } from 'express';
import HttpException from '@/utils/exceptions/http.exception';

function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const status = error.status || 500;
    const messsage = error.message || 'Internal Server Error';

    res.status(status).send({
        status,
        messsage
    });
}

export default errorMiddleware;
