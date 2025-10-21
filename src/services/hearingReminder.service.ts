import Cases from '../models/Case';
import Notifications from '../models/Notifications';
import { User } from '../models';
import { Op } from 'sequelize';
import { cp } from 'fs';

interface HearingReminder {
  caseId: number;
  cpNumber: string;
  caseTitle: string;
  dateOfHearing: Date;
  hoursUntilHearing: number;
  reminderType: 'initial' | 'final';
}

class HearingReminderService {
  
  static async checkUpcomingHearings(): Promise<void> {
    try {
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + (24 * 60 * 60 * 1000));

      // Find cases with hearings in the next 24 hours
      const upcomingCases = await Cases.findAll({
        where: {
          dateOfHearing: {
            [Op.between]: [now, twentyFourHoursLater]
          },
          isDeleted: false
        },
        attributes: ['id', 'cpNumber', 'caseTitle', 'dateOfHearing']
      });

      console.log(`Found ${upcomingCases.length} cases with hearings in next 24 hours`);

      for (const caseItem of upcomingCases) {
        const caseData = caseItem.toJSON() as any;
        const hoursUntilHearing = this.calculateHoursUntilHearing(caseData.dateOfHearing);
        console.log(`Case ${caseData.cpNumber} has hearing in ${hoursUntilHearing} hours`);
        // Only process if hearing is within 24 hours
        if (hoursUntilHearing <= 24 && hoursUntilHearing >= 0) {
          await this.createHearingReminder({
            caseId: caseData.id,
            cpNumber: caseData.cpNumber,
            caseTitle: caseData.caseTitle,
            dateOfHearing: new Date(caseData.dateOfHearing),
            hoursUntilHearing,
            reminderType: 'initial'
          });
        }
      }
    } catch (error) {
      console.error('Error in checkUpcomingHearings:', error);
      throw error;
    }
  }

  static async checkFinalReminders(): Promise<void> {
    try {
      const now = new Date();
      const twelveHoursLater = new Date(now.getTime() + (12 * 60 * 60 * 1000));

      // Find cases with hearings in the next 12 hours
      const urgentCases = await Cases.findAll({
        where: {
          dateOfHearing: {
            [Op.between]: [now, twelveHoursLater]
          },
          isDeleted: false
        },
        attributes: ['id', 'cpNumber', 'caseTitle', 'dateOfHearing']
      });

      console.log(`Found ${urgentCases.length} cases with hearings in next 12 hours`);

      for (const caseItem of urgentCases) {
        const caseData = caseItem.toJSON() as any;
        const hoursUntilHearing = this.calculateHoursUntilHearing(caseData.dateOfHearing);
        
        // Only process if hearing is within 12 hours
        if (hoursUntilHearing <= 12 && hoursUntilHearing > 0) {
          await this.createHearingReminder({
            caseId: caseData.id,
            cpNumber: caseData.cpNumber,
            caseTitle: caseData.caseTitle,
            dateOfHearing: new Date(caseData.dateOfHearing),
            hoursUntilHearing,
            reminderType: 'final'
          });
        }
      }
    } catch (error) {
      console.error('Error in checkFinalReminders:', error);
      throw error;
    }
  }

  private static async createHearingReminder(reminder: HearingReminder): Promise<void> {
    try {
      console.log(`Checking ${reminder.reminderType} reminder for case ${reminder.cpNumber} (${reminder.hoursUntilHearing}h until hearing)`);
      
      const checkNotifiedCases = await Notifications.findOne({
        where: {
          type: 'HEARING_REMINDER_24H',
          cpNumber: reminder.cpNumber
        }
      });

      if (checkNotifiedCases) {
        console.log(`✓ ${reminder.reminderType} reminder already sent for case ${reminder.cpNumber} - skipping`);
        return;
      }
      // if (existingReminder) {
      //   console.log(`✓ ${reminder.reminderType} reminder already exists for case ${reminder.cpNumber} within last 12 hours - skipping`);
      //   return;
      // }

      console.log(`→ Creating new ${reminder.reminderType} reminder for case ${reminder.cpNumber}`);

      // Get all active users for notification
      const users = await User.findAll({
        where: {
          status: 'Approved',
          isActive: true,
          isEmailVerify: true,
          isDeleted: false
        },
        attributes: ['id']
      });

      if (users.length === 0) {
        console.log('No active users found for hearing reminder notifications');
        return;
      }

      // Create notifications for all users using bulkCreate (without audit log)
      const notifications = users.map((user: any) => ({
        type: reminder.reminderType === 'initial' ? 'HEARING_REMINDER_24H' : 'HEARING_REMINDER_12H',
        to: String(user.id),
        isRead: false,
        cpNumber: reminder.cpNumber,
        caseTitle: reminder.caseTitle,
        dateOfHearing: reminder.dateOfHearing.toString(),
        createdBy: '1',
        createdAt: new Date(),
        updatedBy: '1'
      }));

      await Notifications.bulkCreate(notifications);

      console.log(`✓ ${reminder.reminderType} hearing reminder created for case ${reminder.cpNumber} - ${users.length} users notified`);

    } catch (error) {
      console.error('Error creating hearing reminder:', error);
      throw error;
    }
  }

  /**
   * Check if reminder already exists for the case and type within last 12 hours
   */
  private static async checkExistingReminder(cpNumber: string, reminderType: 'initial' | 'final'): Promise<boolean> {
    try {
      const actionType = reminderType === 'initial' ? 'HEARING_REMINDER_24H' : 'HEARING_REMINDER_12H';
      
      // Check if notification was generated within the last 12 hours
      const twelveHoursAgo = new Date(Date.now() - (12 * 60 * 60 * 1000));

      // Check notifications directly for this case type within last 12 hours
      // Since we're not using audit logs anymore, we'll search by notification type and pattern
      const recentNotifications = await Notifications.findOne({
        where: {
          type: actionType,
          createdAt: {
            [Op.gte]: twelveHoursAgo
          }
        },
        order: [['createdAt', 'DESC']]
      });

      if (recentNotifications) {
        console.log(`Found existing ${reminderType} reminder notification created within last 12 hours - skipping duplicate`);
        return true;
      }

      console.log(`No recent ${reminderType} reminder notifications found - proceeding with creation`);
      return false;
      
    } catch (error) {
      console.error('Error checking existing reminder:', error);
      return false; // If error, assume no existing reminder to avoid blocking
    }
  }

  /**
   * Calculate hours until hearing
   */
  private static calculateHoursUntilHearing(hearingDate: Date): number {
    const now = new Date();
    const hearing = new Date(hearingDate);
    const diffInMs = hearing.getTime() - now.getTime();
    return Math.round(diffInMs / (1000 * 60 * 60 * 100)) / 10; // Round to 1 decimal place
  }

  /**
   * Manual trigger for testing purposes
   */
  static async triggerManualCheck(): Promise<{ message: string; processed: number }> {
    try {
      console.log('Manual hearing reminder check triggered');
      
      await this.checkUpcomingHearings();
      await this.checkFinalReminders();

      return {
        message: 'Manual hearing reminder check completed successfully',
        processed: 0 // Could be enhanced to return actual count
      };
    } catch (error) {
      console.error('Error in manual hearing reminder check:', error);
      throw error;
    }
  }

  /**
   * Get hearing reminder statistics
   */
  static async getHearingStats(): Promise<any> {
    try {
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      const twelveHoursLater = new Date(now.getTime() + (12 * 60 * 60 * 1000));

      const hearingsIn24Hours = await Cases.count({
        where: {
          dateOfHearing: {
            [Op.between]: [now, twentyFourHoursLater]
          },
          isDeleted: false
        }
      });

      const hearingsIn12Hours = await Cases.count({
        where: {
          dateOfHearing: {
            [Op.between]: [now, twelveHoursLater]
          },
          isDeleted: false
        }
      });

      return {
        hearingsIn24Hours,
        hearingsIn12Hours,
        lastChecked: now.toISOString()
      };
    } catch (error) {
      console.error('Error getting hearing stats:', error);
      throw error;
    }
  }
}

export default HearingReminderService;