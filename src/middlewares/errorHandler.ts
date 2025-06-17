import { Request, Response, NextFunction } from 'express';
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';

const getSatusCode = (error: any) => {
  const sequelizeErrorNames = ["SequelizeValidationError", "SequelizeUniqueConstraintError"]

  return error.statusCode || sequelizeErrorNames.includes(error.name) ? 400 : 500;
}

export class ErrorResponse extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 404) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

interface CustomError extends Error {
  parent?: {
    code?: string;
  };
}
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let { message } = err;
  let statusCode = getSatusCode(err);

  console.log('Error', { name: err.name, parent: (err as CustomError)?.parent?.code });

  res.locals.errorMessage = err.message;

  if (err instanceof ValidationError) {
    const errors = (err as ValidationError).errors.map(error => ({ field: error.path, message: error.message }));
    message = errors[0].message;
  } else if (err instanceof UniqueConstraintError) {
    message = "Duplicate entry found.";
  } else if (err instanceof ForeignKeyConstraintError && req.method.includes('POST')) {
    message = "Cannot create record due to wrong data provided.";
  } else if (err instanceof ForeignKeyConstraintError) {
    message = "Cannot delete record due to dependent data.";
  } else if (err instanceof ErrorResponse) {
    message = message;
    statusCode = (err as ErrorResponse).statusCode;
  } else if (err.name === 'SequelizeDatabaseError' && (err as CustomError)?.parent?.code === 'WARN_DATA_TRUNCATED') {
    message = "Invalid value provided";
  } else {
    message = "Internal Server Error";
  }

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

export default errorHandler;