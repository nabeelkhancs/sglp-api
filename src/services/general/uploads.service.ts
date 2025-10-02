import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Uploads from '../../models/Uploads';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

class UploadsService {
  private uploadDir: string;

  constructor(uploadDir: string = UPLOAD_DIR) {
    this.uploadDir = uploadDir;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Generate a hash for the file
  private generateFileHash(buffer: Buffer, originalName: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256')
      .update(buffer)
      .update(originalName)
      .update(timestamp.toString())
      .digest('hex');
    return hash;
  }

  // Handle single file upload
  async uploadSingleFile(req: Request): Promise<string> {
    const file = (req as any).file;
    console.log("aaaaaaaaaaa", file);
    if (!file) throw new Error('No file uploaded');
    const fileHash = this.generateFileHash(file.buffer, file.originalname);
    const ext = path.extname(file.originalname);
    const fileName = `${fileHash}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    // Save file info to uploads table
    await Uploads.create({
      fileHash,
      originalName: file.originalname,
      filePath,
      uploadedBy: req.user?.id // Assuming req.user contains authenticated user info
    });
    return fileHash;
  }

  // Handle multiple file uploads
  async uploadMultipleFiles(req: Request): Promise<string[]> {
    const files = (req as any).files;
    if (!files || !Array.isArray(files) || files.length === 0) throw new Error('No files uploaded');
    const fileHashes: string[] = [];
    for (const file of files) {
      const fileHash = this.generateFileHash(file.buffer, file.originalname);
      const ext = path.extname(file.originalname);
      const fileName = `${fileHash}${ext}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      await Uploads.create({
        fileHash,
        originalName: file.originalname,
        filePath,
        uploadedBy: req.user?.id // Assuming req.user contains authenticated user info
      });
      fileHashes.push(fileHash);
    }
    return fileHashes;
  }
}

export default new UploadsService();
