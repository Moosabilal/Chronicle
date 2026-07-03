import 'reflect-metadata';
import { injectable } from 'inversify';
import { IUploadService } from '../interfaces/services/IUploadService';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

@injectable()
export class UploadService implements IUploadService {
  async uploadImage(fileBuffer: Buffer, mimetype: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'chronicle',
          resource_type: 'image',
          transformation: [{ width: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result.secure_url);
        }
      );

      const readable = Readable.from(fileBuffer);
      readable.pipe(uploadStream);
    });
  }
}
