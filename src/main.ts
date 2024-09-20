import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: { groupId: 'kafka-test' },
      client: {
        ssl: true,
        rejectUnauthorized: false,
        sasl: {
          mechanism: 'plain',
          password:
            'W7ioyLOGFtVX9rsHNO5t0xNpDOW6kSHJbEB1iHxjM5SOJamALqFnvvW1/P8nWfP4',
          username: 'SLTOY7I7LP5OB2VW',
        },
        brokers: ['pkc-4j8dq.southeastasia.azure.confluent.cloud:9092'],
        retry: {
          retries: 5,
          initialRetryTime: 1000,
          maxRetryTime: 30000,
        },
        connectionTimeout: 3000,
        authenticationTimeout: 10000,
      },
    },
  } as MicroserviceOptions);
  app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
