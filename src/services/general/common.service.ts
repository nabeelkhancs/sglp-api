import { Request, Response } from 'express';
import PermissionsService from '../rbac/permissions.service';
import * as jwt from 'jsonwebtoken';
import CaseRepository from '../../repositories/general/CaseRepository';
import CommitteeRepository from '../../repositories/general/CommitteeRepository';
import uploadsService from './uploads.service';
import Uploads from '../../models/Uploads';

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
}

export default CommonService;
