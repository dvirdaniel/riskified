import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MerchantIdentifierMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.header('merchant-identifier')) {
            throw new HttpException('Missing merchant identifier header', HttpStatus.FORBIDDEN);
        }
        next();
    }
}
