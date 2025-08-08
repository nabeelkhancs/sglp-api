
import { Request, Response } from 'express';
import asyncHandler from '../../common/asyncHandler';
import NotificationRepository from '../../repositories/general/NotificationRepository';

class NotificationService {
  
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const where: any = { isDeleted: false };
    const userId = req.user?.id || null;
    if (userId) where.to = String(userId); 
    const order = [['createdAt', 'DESC']];
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    console.log("where:", where);
    const notifications = await NotificationRepository.findAll(where, order, Number(pageNumber), Number(pageSize));
    res.generalResponse('Notifications fetched successfully!', notifications);
  });

  
  static markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const notification = await NotificationRepository.updateIsRead(id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.generalResponse('Notification marked as read!', notification);
  });

  static markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id || null;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
    
    const notifications = await NotificationRepository.updateAllIsRead(userId);
    res.generalResponse('All notifications marked as read!', notifications);
  });

  static markMultipleAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid IDs array' });
    }

    const notifications = await Promise.all(
      ids.map(id => NotificationRepository.updateIsRead(id))
    );

    res.generalResponse('Notifications marked as read!', notifications);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const notif = await NotificationRepository.create(req.body);
    res.status(201).generalResponse('Notification created successfully!', notif);
  });
}

export default NotificationService;
