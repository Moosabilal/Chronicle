import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { IAuthService } from '../interfaces/services/IAuthService';
import TYPES from '../container/types';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {}

  register = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  });
}
