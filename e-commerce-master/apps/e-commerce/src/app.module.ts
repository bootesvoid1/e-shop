import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';
import { AuthController } from './auth.controller';
import { TagsController } from './tags.controller';
import { ProductFeatureController } from './product_feature.controller';
import { ManufacturorController } from './manufacturor.controller';
import { VariantsController } from './variants.controller';
import { SharedAuthModule } from '@app/auth';
import { CartController } from './cart.controller';
import { OrderController } from './order.controller';

@Module({
  imports: [
    SharedAuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3002,
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

      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3005,
        },
      },
    ]),
  ],
  controllers: [
    AuthController,
    ProductController,
    CategoryController,
    ProductFeatureController,
    TagsController,
    ManufacturorController,
    VariantsController,
    CartController,
    OrderController,
  ],
  providers: [AppService],
})
export class AppModule {}
