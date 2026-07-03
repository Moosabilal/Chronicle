import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error.errors) {
        const message = error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
};
