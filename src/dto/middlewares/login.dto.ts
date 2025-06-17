import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import LoginDTO from '../classes/Login.dto';

const LoginUserDTO = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginData: LoginDTO = req.body;
    const errors = await validate(loginData);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
      res.status(400).json({ errors: errorMessages });
      return;
    }

    next();
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default LoginUserDTO;