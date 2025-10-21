import { Request, Response } from 'express';
import PermissionsService from '../rbac/permissions.service';
import * as jwt from 'jsonwebtoken';
import CaseRepository from '../../repositories/general/CaseRepository';
import CommitteeRepository from '../../repositories/general/CommitteeRepository';
import uploadsService from './uploads.service';
import Uploads from '../../models/Uploads';
import SequelizeClass from '../../../database/sequelize';

class CommonService {
  static async getPageActionsByRole(roleId: number, pageLabel: string) {
    const permissions = await PermissionsService.getPermissionsByRole(roleId);
    const pagePermission = permissions.find(
      (perm: any) => perm.Page && perm.Page.label === pageLabel
    );
    let actions: string[] = [];
    if (pagePermission && Array.isArray(pagePermission.Permissions)) {
      actions = pagePermission.Permissions.map((p: any) => p.Action?.name).filter(Boolean);
    }
    return actions;
  }

  static generateEmailVerificationToken(userId: number, email: string): string {
    // 24 hours expiry
    const payload = {
      userId,
      email,
      type: 'email_verification'
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not defined');
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  static generatePasswordResetToken(userId: number, email: string): string {
    // 1 hour expiry for security
    const payload = {
      userId,
      email,
      type: 'password_reset'
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not defined');
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  static verifyPasswordResetToken(token: string): { userId: number; email: string } | null {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not defined');
      
      const decoded: any = jwt.verify(token, secret);
      
      if (decoded.type !== 'password_reset') {
        return null;
      }
      
      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }

  static async uploadFiles(req: Request, res: Response) {

    let token = '';   
    if (req?.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1].trim()
    }

    if (!token) {
      return res.generalError("Authentication required", { error: 'Authentication required' }, 401);
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '')
    req.user = decoded;

    console.log("req.user", req.user);

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    await Promise.all(files.map(file => Uploads.create({
      fileHash: file.filename.split('-')[0],
      originalName: file.originalname,
      filePath: file.path,
      uploadedBy: req.user?.id
    })));

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      files,
    });
  }

  static async getDashboardCases(req: Request, res: Response) {
    const cases = await CaseRepository.getDashboardCases();
    const committees = await CommitteeRepository.getCommittees();
    res.generalResponse('Dashboard cases fetched successfully!', { cases, committees: committees?.rows });
  }

  static async uploadFilesDetails(req: Request, res: Response) {
    try {
      const { ids } = req.body; // Expecting an array of upload IDs (fileHash)
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "No upload IDs provided" });
      }
      const sequelize = SequelizeClass.getInstance().sequelize;
      const query = `
        SELECT u.*, usr.name as uploadedByName, usr.email as uploadedByEmail
        FROM uploads u
        LEFT JOIN users usr ON u."uploadedBy" = usr.id
        WHERE u."fileHash" IN (:ids)
      `;
      const uploads: any = await sequelize.query(query, {
        replacements: { ids },
        type: require('sequelize').QueryTypes.SELECT
      });
      if (!uploads || uploads.length === 0) {
        return res.status(404).json({ message: "No uploads found" });
      }
      res.generalResponse('Upload details fetched successfully!', { uploads });
    } catch (error) {
      console.error('Error fetching upload details:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async uploadPublicFiles(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      await Promise.all(files.map(file => Uploads.create({
        fileHash: file.filename.split('-')[0],
        originalName: file.originalname,
        filePath: file.path,
        uploadedBy: 0
      })));

      res.json({
        message: `${files.length} file(s) uploaded successfully`,
        files,
      });
    } catch (error) {
      console.error('Error uploading public files:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CommonService;
