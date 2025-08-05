import Notifications from '../../models/Notifications';
import AuditLogs from '../../models/AuditLogs';
import Paginate from '../../common/paginate';
import { User } from '../../models';

class NotificationRepository {
  static async findAll(where: any, order: any = [], pageNumber: number = 1, pageSize: number = 10) {
    try {
      console.log("Finding notifications with where:", where, "and order:", order);
      
      const include = [
        {
          model: AuditLogs,
          as: 'auditLog',
          include: [{
            model: User,
            attributes: ['id', 'name', 'email'],
            as: 'user'
          }]
        },
      ];
      
      const attributes = undefined; // Use all attributes
      
      return await Paginate(Notifications, Number(pageNumber), Number(pageSize), where, include, attributes);
    } catch (error) {
      console.error('Error in NotificationRepository.findAll:', error);
      throw error;
    }
  }

  static async findByPk(id: number) {
    try {
      return await Notifications.findByPk(id);
    } catch (error) {
      console.error('Error in NotificationRepository.findByPk:', error);
      throw error;
    }
  }

  static async create(data: any) {
    try {
      return await Notifications.create(data);
    } catch (error) {
      console.error('Error in NotificationRepository.create:', error);
      throw error;
    }
  }

  static async updateIsRead(id: number) {
    try {
      const notification: any = await Notifications.findByPk(id);
      if (!notification) return null;
      notification.isRead = true;
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error in NotificationRepository.updateIsRead:', error);
      throw error;
    }
  }

  static async getAuditLogById(auditLogId: number) {
    try {
      return await AuditLogs.findByPk(auditLogId);
    } catch (error) {
      console.error('Error in NotificationRepository.getAuditLogById:', error);
      throw error;
    }
  }
}

export default NotificationRepository;
