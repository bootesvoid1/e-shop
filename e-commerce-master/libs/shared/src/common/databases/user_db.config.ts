import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UsersEntity } from './entities/user.entity';


export const userDBdataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USER_NAME || 'ecommerce_users', 
  entities: [UsersEntity],
  migrations: ['dist/apps/user/database/migrations/*.js'], 
  synchronize: process.env.NODE_ENV !== 'production', 
  logging: process.env.NODE_ENV !== 'production', 
};

// Optionally export DataSource for manual initialization (if needed)
export const UserAppDataSource = new DataSource(userDBdataSourceOptions);