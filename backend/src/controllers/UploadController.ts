import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { IUploadService } from '../interfaces/services/IUploadService';
import TYPES from '../container/types';

@injectable()
export class UploadController {
  constructor(
    @inject(TYPES.IUploadService) private uploadService: IUploadService
  ) {}

  uploadImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const url = await this.uploadService.uploadImage(req.file.buffer, req.file.mimetype);
    res.status(200).json({ success: true, data: { url } });
  });
}
