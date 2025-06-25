import PermissionsService from '../rbac/permissions.service';
import * as jwt from 'jsonwebtoken';

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
}

export default CommonService;
