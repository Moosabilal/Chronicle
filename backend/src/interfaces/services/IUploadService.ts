export interface IUploadService {
  uploadImage(fileBuffer: Buffer, mimetype: string): Promise<string>;
}
