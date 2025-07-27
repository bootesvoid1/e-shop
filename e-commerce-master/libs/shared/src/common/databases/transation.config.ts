import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CartEntity } from './entities/cart/cart.entity';
import { CartItemEntity } from './entities/cart/cart_items.entity';
import { OrderEntity } from './entities/order/order.entity';
import { OrderItemEntity } from './entities/order/order-item.entity';

// Export DataSourceOptions for use with NestJS TypeOrmModule
export const transactionDBdataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TRANSACTION_NAME || 'ecommerce_transactions', 
  entities: [CartEntity, CartItemEntity, OrderEntity, OrderItemEntity],
  migrations: ['dist/apps/transaction/database/migrations/*.js'], // Adjust path to match project structure
  synchronize: process.env.NODE_ENV !== 'production', // Disable synchronize in production
  logging: process.env.NODE_ENV !== 'production', // Enable logging in non-production for debugging
};

// Optionally export DataSource for manual initialization (if needed)
export const TransactionAppDataSource = new DataSource(transactionDBdataSourceOptions);