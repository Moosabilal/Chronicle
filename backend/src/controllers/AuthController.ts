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

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, message: 'Email sent' });
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.params.token as string, req.body.password);
    res.status(200).json({ success: true, message: 'Password reset successful' });
  });

  updateProfile = catchAsync(async (req: Request, res: Response) => {
    const updatedUser = await this.authService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  });
}
