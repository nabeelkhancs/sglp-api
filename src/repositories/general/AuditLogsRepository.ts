import AuditLogs from '../../models/AuditLogs';
import { IAuditLogs } from '../../models/interfaces';
import { Request } from 'express';
import Notifications from '../../models/Notifications';
import { create } from 'domain';
class AuditLogsRepository {
  static async createLog(logData: Omit<IAuditLogs, 'id'>): Promise<AuditLogs> {
    try {
      const log: any = await AuditLogs.create(logData);
      return log;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw new Error('Could not create audit log');
    }
  }

  /**
   * Logs an action using req.body, optional cpNumber, and req (for user info)
   * @param body - The request body (payload)
   * @param req - The Express request object
   * @param cpNumber - Optional cpNumber for the log
   * @param action - Optional action string (default: 'ACTION')
   */
  static async logAction(body: any, req: Request, cpNumber?: string, action: string = 'ACTION') {
    try {
      console.log('Logging audit action:', body);
      const userId = req.user?.id || 1;
      const log: any = await AuditLogs.create({
        action,
        cpNumber: (cpNumber || body.cpNumber || body.caseNumber) ? String(cpNumber || body.cpNumber || body.caseNumber) : undefined,
        payload: JSON.stringify(body),
        userId: Number(userId),
        isDeleted: false,
        createdBy: userId,
        updatedBy: userId,
        deletedBy: "",
        deletedAt: null
      });

      // Import User model here to avoid circular dependency
      // const User = (await import('../../models/Users')).default;
      // const users = await User.findAll({
      //   where: {
      //     status: 'Approved',
      //     isActive: true,
      //     isEmailVerify: true,
      //     isDeleted: false
      //   },
      //   attributes: ['id']
      // });
      // console.log('Users found for notification:', users.length);
      // const notifications = users.map((user: any) => ({
      //   type: log.action,
      //   to: String(user.id),
      //   auditLogId: log.id,
      //   createdBy: log.createdBy ?? null,
      //   updatedBy: log.updatedBy ?? null,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // }));
      // if (notifications.length > 0) {
      //   await Notifications.bulkCreate(notifications);
      // }
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }
}

export default AuditLogsRepository; 