import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3005,
      },
    },
  );
  await app.listen();
}
bootstrap();
