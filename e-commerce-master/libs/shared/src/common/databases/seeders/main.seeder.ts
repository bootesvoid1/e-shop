import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { AdminSeeder } from './admin-seeder';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await runSeeder(dataSource, AdminSeeder);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  }
}
