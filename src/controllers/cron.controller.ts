import { Request, Response } from 'express';
import HearingReminderService from '../services/hearingReminder.service';
import APIResponse from '../lib/classes/APIResponse';

class CronController {

  static async triggerHearingReminders(req: Request, res: Response): Promise<void> {
    try {
      const result = await HearingReminderService.triggerManualCheck();
      
      res.status(200).json(
        APIResponse.success('Hearing reminder checks triggered successfully', result)
      );
    } catch (error: any) {
      console.error('Error triggering hearing reminders:', error);
      res.status(500).json(
        APIResponse.error('Failed to trigger hearing reminder checks', 500, null, error?.message)
      );
    }
  }

  static async getHearingStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await HearingReminderService.getHearingStats();
      
      res.status(200).json(
        APIResponse.success('Hearing statistics retrieved successfully', stats)
      );
    } catch (error: any) {
      console.error('Error getting hearing stats:', error);
      res.status(500).json(
        APIResponse.error('Failed to get hearing statistics', 500, null, error?.message)
      );
    }
  }

  static async checkUpcomingHearings(req: Request, res: Response): Promise<void> {
    try {
      await HearingReminderService.checkUpcomingHearings();
      
      res.status(200).json(
        APIResponse.success(
          'Upcoming hearings check completed successfully',
          { checked: true, timestamp: new Date().toISOString() }
        )
      );
    } catch (error: any) {
      console.error('Error checking upcoming hearings:', error);
      res.status(500).json(
        APIResponse.error('Failed to check upcoming hearings', 500, null, error?.message)
      );
    }
  }

  static async checkFinalReminders(req: Request, res: Response): Promise<void> {
    try {
      await HearingReminderService.checkFinalReminders();
      
      res.status(200).json(
        APIResponse.success(
          'Final reminders check completed successfully',
          { checked: true, timestamp: new Date().toISOString() }
        )
      );
    } catch (error: any) {
      console.error('Error checking final reminders:', error);
      res.status(500).json(
        APIResponse.error('Failed to check final reminders', 500, null, error?.message)
      );
    }
  }

}

export default CronController;