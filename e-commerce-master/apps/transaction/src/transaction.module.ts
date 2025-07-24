import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { transationDBDataSourceOptions } from '@app/shared/common/databases/transation.config';
import { CartEntity } from '@app/shared/common/databases/entities/cart/cart.entity';
import { CartItemEntity } from '@app/shared/common/databases/entities/cart/cart_items.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { OrderService } from './order/order.service';
import { OrderEntity } from '@app/shared/common/databases/entities/order/order.entity';
import { OrderItemEntity } from '@app/shared/common/databases/entities/order/order-item.entity';
import { OrderBroker } from './order/order.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(transationDBDataSourceOptions),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3005,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [TransactionController, CartController, OrderBroker],
  providers: [TransactionService, CartService, OrderService],
})
export class TransactionModule {}
