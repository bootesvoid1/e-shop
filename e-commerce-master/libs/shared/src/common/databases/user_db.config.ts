import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UsersEntity } from './entities/user.entity';

config();

const configService = new ConfigService();

export const userDBdataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_USER_NAME'),
  entities: [UsersEntity],

  migrations: ['dist/common/database/migrations/*.js'],
  synchronize: true,
};

export const UserAppDataSource = new DataSource(userDBdataSourceOptions);
