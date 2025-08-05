import Notifications from '../../models/Notifications';

class NotificationService {
  // Get all notifications (optionally for a user)
  static async getAll(userId?: string) {
    const where: any = { isDeleted: false };
    if (userId) where.to = userId;
    return Notifications.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  // Mark notification as read
  static async markAsRead(id: number) {
    const notification: any | null = await Notifications.findByPk(id);
    if (!notification) throw new Error('Notification not found');
    notification.isRead = true;
    await notification.save();
    return notification;
  }

  // Create a notification
  static async create(data: any) {
    return Notifications.create(data);
  }
}

export default NotificationService;
