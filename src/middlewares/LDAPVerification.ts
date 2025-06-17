import { Request, Response, NextFunction } from 'express';

const LDAPVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        next();
    } catch(err) {
        console.log("ERROR: ", err);
    }
};

export default LDAPVerification;
