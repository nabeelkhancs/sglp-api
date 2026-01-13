import * as cron from 'node-cron';
import HearingReminderService from '../services/hearingReminder.service';

class CronJobs {
  static init() {
    console.log('Initializing cron jobs...');


    // Run every day at 6:00 AM to check for hearings 2 and 5 days before
    cron.schedule('0 6 * * *', async () => {
      console.log('Running daily 2/5 day hearing reminder cron job at:', new Date().toISOString());
      try {
        await HearingReminderService.checkHearings2And5DaysBefore();
        await HearingReminderService.checkUpcomingHearings24Hours();
      } catch (error) {
        console.error('Error in 2/5 day hearing reminder cron job:', error);
      }
    });

    console.log('Cron jobs initialized successfully');
  }

  static stop() {
    console.log('Stopping all cron jobs...');
    console.log('Cron jobs stopped');
  }
}

export default CronJobs;