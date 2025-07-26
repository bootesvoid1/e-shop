import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CartItemEntity } from './entities/cart/cart_items.entity';
import { CartEntity } from './entities/cart/cart.entity';
import { OrderEntity } from './entities/order/order.entity';
import { OrderItemEntity } from './entities/order/order-item.entity';
/* load dotenv only in non-production */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
config();

const configService = new ConfigService();

export const transationDBDataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_TRANSACTION_NAME'),
  entities: [CartEntity, CartItemEntity, OrderEntity, OrderItemEntity],

  migrations: ['dist/common/database/migrations/*.js'],
  synchronize: true,
};

export const TransationAppDataSource = new DataSource(
  transationDBDataSourceOptions,
);
