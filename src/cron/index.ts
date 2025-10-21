import * as cron from 'node-cron';
import HearingReminderService from '../services/hearingReminder.service';

class CronJobs {
  static init() {
    console.log('Initializing cron jobs...');

    // Run every day at 9:00 AM to check for upcoming hearings (24 hours before)
    // cron.schedule('0 9 * * *', async () => {
    cron.schedule('* * * * *', async () => {
      console.log('Running daily hearing reminder cron job at:', new Date().toISOString());
      try {
        await HearingReminderService.checkUpcomingHearings();
      } catch (error) {
        console.error('Error in hearing reminder cron job:', error);
      }
    });

    // Run every day at 10:00 AM to check for final reminders (12 hours before)
    // cron.schedule('* * * * *', async () => {
    //   console.log('Running daily final hearing reminder cron job at:', new Date().toISOString());
    //   try {
    //     await HearingReminderService.checkFinalReminders();
    //   } catch (error) {
    //     console.error('Error in final hearing reminder cron job:', error);
    //   }
    // });

    console.log('Cron jobs initialized successfully');
  }

  static stop() {
    console.log('Stopping all cron jobs...');
    console.log('Cron jobs stopped');
  }
}

export default CronJobs;