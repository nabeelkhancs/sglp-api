import AuditLogs from '../../models/AuditLogs';
import { IAuditLogs } from '../../models/interfaces';
import { Request } from 'express';

class AuditLogsRepository {
  static async createLog(logData: Omit<IAuditLogs, 'id'>): Promise<AuditLogs> {
    try {
      const log = await AuditLogs.create(logData);
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
      const userId = req.user?.id || null;
      await AuditLogs.create({
        action,
        cpNumber: (cpNumber || body.cpNumber || body.caseNumber) ? String(cpNumber || body.cpNumber || body.caseNumber) : undefined,
        payload: JSON.stringify(body),
        userId,
        isDeleted: false,
        createdBy: userId,
        updatedBy: userId,
        deletedBy: "",
        deletedAt: null
      });
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }
}

export default AuditLogsRepository; 