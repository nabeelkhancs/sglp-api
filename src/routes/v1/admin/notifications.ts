import { Router } from 'express';
import NotificationService from '../../../services/general/notification.service';

const router = Router();

router.get('/', NotificationService.getAll);
router.patch('/:id/read', NotificationService.markAsRead);
// router.post('/', NotificationService.create);

export default router;
