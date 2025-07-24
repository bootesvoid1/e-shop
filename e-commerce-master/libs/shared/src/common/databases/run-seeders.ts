import { runSeeders } from 'typeorm-extension';
import { UserAppDataSource } from './user_db.config';
import { MainSeeder } from './seeders/main.seeder';

async function runAllSeeders() {
  try {
    // Initialize the data source
    await UserAppDataSource.initialize();
    console.log('Data source has been initialized');

    // Run seeders
    await runSeeders(UserAppDataSource, {
      seeds: [MainSeeder],
    });
    console.log('Seeders have been executed successfully');

    // Close the connection
    await UserAppDataSource.destroy();
    console.log('Connection has been closed');
  } catch (error) {
    console.error('Error during seeding', error);
    if (UserAppDataSource.isInitialized) {
      await UserAppDataSource.destroy();
    }
    process.exit(1);
  }
}

runAllSeeders();
