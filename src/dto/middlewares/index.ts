import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate } from 'class-validator';

type DTOType<T> = { new(): T };

function validateDTO<T>(DTOClass: DTOType<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance: any = new DTOClass();
      Object.assign(dtoInstance, req.body);
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
        return res.generalError("Validation Error!", { errors: errorMessages }, 400);
      }

      next();
    } catch (err) {
      console.error("Error validating DTO:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default validateDTO;
