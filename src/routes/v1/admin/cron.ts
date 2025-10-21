import { Router } from 'express';
import CronController from '../../../controllers/cron.controller';

const router = Router();

/**
 * @route   POST /api/v1/admin/cron/trigger-hearing-reminders
 * @desc    Manual trigger for hearing reminder checks
 * @access  Admin
 */
router.post('/trigger-hearing-reminders', CronController.triggerHearingReminders);

/**
 * @route   GET /api/v1/admin/cron/hearing-stats
 * @desc    Get hearing reminder statistics
 * @access  Admin
 */
router.get('/hearing-stats', CronController.getHearingStats);

/**
 * @route   POST /api/v1/admin/cron/check-upcoming
 * @desc    Check upcoming hearings (24-hour check)
 * @access  Admin
 */
router.post('/check-upcoming', CronController.checkUpcomingHearings);

/**
 * @route   POST /api/v1/admin/cron/check-final
 * @desc    Check final reminders (12-hour check)
 * @access  Admin
 */
router.post('/check-final', CronController.checkFinalReminders);

export default router;