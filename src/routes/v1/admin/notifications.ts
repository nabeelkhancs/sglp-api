import { Router } from 'express';
import NotificationService from '../../../services/general/notification.service';

const router = Router();

router.get('/', NotificationService.getAll);
router.patch('/:id/read', NotificationService.markAsRead);
router.patch('/all/read', NotificationService.markAllAsRead);
router.patch('/multiple/read', NotificationService.markMultipleAsRead);
// router.post('/', NotificationService.create);

export default router;
