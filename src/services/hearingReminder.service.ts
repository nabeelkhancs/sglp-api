
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
  /**
   * Check hearings 2 and 5 days before the hearing date
   */
  static async checkHearings2And5DaysBefore(): Promise<void> {
    try {
      const now = new Date();
      // 2 days and 5 days from now
      const twoDaysLater = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
      const fiveDaysLater = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));

      // Find cases with hearings exactly 2 or 5 days from now (ignore time part)
      const startOfTwoDay = new Date(twoDaysLater);
      startOfTwoDay.setHours(0, 0, 0, 0);
      const endOfTwoDay = new Date(twoDaysLater);
      endOfTwoDay.setHours(23, 59, 59, 999);

      const startOfFiveDay = new Date(fiveDaysLater);
      startOfFiveDay.setHours(0, 0, 0, 0);
      const endOfFiveDay = new Date(fiveDaysLater);
      endOfFiveDay.setHours(23, 59, 59, 999);

      // Query for both 2 days and 5 days
      const cases = await Cases.findAll({
        where: {
          dateOfHearing: {
            [Op.or]: [
              { [Op.between]: [startOfTwoDay, endOfTwoDay] },
              { [Op.between]: [startOfFiveDay, endOfFiveDay] }
            ]
          },
          isDeleted: false
        },
        attributes: ['id', 'cpNumber', 'caseTitle', 'dateOfHearing']
      });

      console.log(`Found ${cases.length} cases with hearings in 2 or 5 days`);

      for (const caseItem of cases) {
        const caseData = caseItem.toJSON() as any;
        const hearingDate = new Date(caseData.dateOfHearing);
        const daysUntilHearing = Math.ceil((hearingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let reminderType: '2day' | '5day' = daysUntilHearing === 2 ? '2day' : '5day';

        // Check if notification already sent for this type
        const notificationType = reminderType === '2day' ? 'HEARING_REMINDER_2DAY' : 'HEARING_REMINDER_5DAY';
        const alreadySent = await Notifications.findOne({
          where: {
            type: notificationType,
            cpNumber: caseData.cpNumber
          }
        });
        if (alreadySent) {
          console.log(`✓ ${reminderType} reminder already sent for case ${caseData.cpNumber} - skipping`);
          continue;
        }

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
          continue;
        }

        // Create notifications for all users
        const notifications = users.map((user: any) => ({
          type: notificationType,
          to: String(user.id),
          isRead: false,
          cpNumber: caseData.cpNumber,
          caseTitle: caseData.caseTitle,
          dateOfHearing: hearingDate.toString(),
          createdBy: '1',
          createdAt: new Date(),
          updatedBy: '1'
        }));
        await Notifications.bulkCreate(notifications);
        console.log(`✓ ${reminderType} hearing reminder created for case ${caseData.cpNumber} - ${users.length} users notified`);
      }
    } catch (error) {
      console.error('Error in checkHearings2And5DaysBefore:', error);
      throw error;
    }
  }
  
  static async checkUpcomingHearings24Hours(): Promise<void> {
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
      
      await this.checkUpcomingHearings24Hours();
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