import { Request, Response, NextFunction } from 'express';
import APIResponse from '../lib/classes/APIResponse';
import { getResponseMethod } from '../lib/helpers';
import FS from '../common/file';

declare global {
    namespace Express {
        interface Response {
            generalResponse(message: string, data?: any): void;
            generalError(message: string, data?: any, errorCode?: number | null, responseCodeDescription?: string | null): void;
        }
    }
}

export default function handleAPIResponse(req: Request, res: Response, next: NextFunction): void {
    try {
        res.generalResponse = function (message: string, data: any = null): void {
            FS.writeText({
                data,
                message,
                status: 'success',
                code: getResponseMethod(req.method),
                endPoint: req.originalUrl
            })
            res.json(APIResponse.success(message, data, getResponseMethod(req.method) || 200));
        };
        

        res.generalError = function (message: string, data: any = null, errorCode: number | null = null, responseCodeDescription: string | null = null): void {
            FS.writeText({
                data,
                message,
                status: 'failure',
                code: errorCode || 400,
                endPoint: req.originalUrl
            })
            res.status(errorCode || 400).json(APIResponse.error(message, errorCode, data, responseCodeDescription));
        };

        next();
    } catch (err) {
        const errorMessage = typeof err === 'string' ? err : null;
        res.status(500).json(APIResponse.error("Internal Server Error", 500, null, errorMessage));
    }
}
