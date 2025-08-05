
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import NotificationRepository from '../../repositories/general/NotificationRepository';

class NotificationService {
  // Get all notifications (optionally for a user)
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const where: any = { isDeleted: false };
    const userId = req.user?.id || null;
    if (userId) where.to = String(userId); // Convert to string to match VARCHAR column
    const order = [['createdAt', 'DESC']];
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    console.log("where:", where);
    const notifications = await NotificationRepository.findAll(where, order, Number(pageNumber), Number(pageSize));
    res.generalResponse('Notifications fetched successfully!', notifications);
  });

  // Mark notification as read
  static markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const notification = await NotificationRepository.updateIsRead(id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.generalResponse('Notification marked as read!', notification);
  });

  // Create a notification
  static create = asyncHandler(async (req: Request, res: Response) => {
    const notif = await NotificationRepository.create(req.body);
    res.status(201).generalResponse('Notification created successfully!', notif);
  });
}

export default NotificationService;
