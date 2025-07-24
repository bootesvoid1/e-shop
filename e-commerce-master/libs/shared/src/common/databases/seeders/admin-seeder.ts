import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UsersEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UsersEntity);
    // Check if data already exists
    const existingRecords = await userRepository.find({
      where: { role: 'admin' },
    });
    if (existingRecords.length > 0) {
      console.log('Users  already exist. Skipping seeding...');
      return;
    }
    // Create and save entities in a transaction
    await dataSource.transaction(async (transactionalEntityManager) => {
      const user = userRepository.create({
        firstName: 'Taha',
        lastName: 'Lajili',
        email: 'taha.lajili@gmail.com',
        phoneNumber: '22275065',
        address: 'msaken sousse',
        role: 'admin',
        password: await bcrypt.hash('azerty', 10),
      });

      await transactionalEntityManager.save(user);
    });

    console.log('Admin  seeded successfully!');
  }
}
