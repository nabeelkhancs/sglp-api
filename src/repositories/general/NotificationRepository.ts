import Notifications from '../../models/Notifications';
import AuditLogs from '../../models/AuditLogs';
import SequelizeClass from '../../../database/sequelize';
import { QueryTypes } from 'sequelize';
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

  static async getNotificationCountByCategory(userId: string) {
    try {
      const sequelize = SequelizeClass.getInstance().sequelize;
      
      const query = `
        WITH notification_cases AS (
          SELECT 
            n.id as notification_id,
            n."isRead",
            c."caseStatus",
            c."cpNumber"
          FROM notifications n
          LEFT JOIN "auditLogs" al ON n."auditLogId" = al.id
          LEFT JOIN cases c ON al."cpNumber" = c."cpNumber"
          WHERE n."to" = :userId::text 
            AND n."isDeleted" = false
        )
        SELECT 
          COUNT(*) FILTER (WHERE "isRead" = false) as total_unread,
          COUNT(*) as total_notifications,
          
          -- All cases count and IDs
          COUNT(*) FILTER (WHERE "isRead" = false AND "cpNumber" IS NOT NULL) as all_cases_unread_count,
          ARRAY_AGG(notification_id) FILTER (WHERE "isRead" = false AND "cpNumber" IS NOT NULL) as all_cases_unread_ids,
          
          -- Direction cases
          COUNT(*) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['direction']) as direction_unread_count,
          ARRAY_AGG(notification_id) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['direction']) as direction_unread_ids,
          
          -- CS Called In Person cases
          COUNT(*) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['csCalledInPerson']) as cs_called_unread_count,
          ARRAY_AGG(notification_id) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['csCalledInPerson']) as cs_called_unread_ids,
          
          -- Contempt cases
          COUNT(*) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['contempt']) as contempt_unread_count,
          ARRAY_AGG(notification_id) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['contempt']) as contempt_unread_ids,
          
          -- Under Compliance cases
          COUNT(*) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['underCompliance']) as under_compliance_unread_count,
          ARRAY_AGG(notification_id) FILTER (WHERE "isRead" = false AND "caseStatus"::text[] && ARRAY['underCompliance']) as under_compliance_unread_ids
          
        FROM notification_cases;
      `;
      
      const replacements = { userId };
      
      console.log('Notification Count Query:', query);
      console.log('Replacements:', replacements);
      
      const result = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });
      
      const data = result[0] as any;
      
      return {
        totalUnread: parseInt(data.total_unread) || 0,
        totalNotifications: parseInt(data.total_notifications) || 0,
        categories: {
          allCases: {
            unreadCount: parseInt(data.all_cases_unread_count) || 0,
            unreadIds: data.all_cases_unread_ids ? data.all_cases_unread_ids.filter((id: any) => id !== null) : []
          },
          direction: {
            unreadCount: parseInt(data.direction_unread_count) || 0,
            unreadIds: data.direction_unread_ids ? data.direction_unread_ids.filter((id: any) => id !== null) : []
          },
          csCalledInPerson: {
            unreadCount: parseInt(data.cs_called_unread_count) || 0,
            unreadIds: data.cs_called_unread_ids ? data.cs_called_unread_ids.filter((id: any) => id !== null) : []
          },
          contempt: {
            unreadCount: parseInt(data.contempt_unread_count) || 0,
            unreadIds: data.contempt_unread_ids ? data.contempt_unread_ids.filter((id: any) => id !== null) : []
          },
          underCompliance: {
            unreadCount: parseInt(data.under_compliance_unread_count) || 0,
            unreadIds: data.under_compliance_unread_ids ? data.under_compliance_unread_ids.filter((id: any) => id !== null) : []
          }
        }
      };
    } catch (error) {
      console.error('Error in NotificationRepository.getNotificationCountByCategory:', error);
      throw error;
    }
  }

  static async updateAllIsRead(userId: number) {
    try {
      const notifications = await Notifications.update(
        { isRead: true },
        { where: { to: String(userId), isDeleted: false } }
      );
      return notifications;
    } catch (error) {
      console.error('Error in NotificationRepository.updateAllIsRead:', error);
      throw error;
    }
  }

}

export default NotificationRepository;
