import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true,
      },
      consumer: {
        groupId: 'kafka-test-store',
        sessionTimeout: 30000,
        heartbeatInterval: 10000,
        maxPollInterval: 300000,
        retry: {
          retries: 5,
          initialRetryTime: 1000,
          maxRetryTime: 30000,
        },
      },
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
        connectionTimeout: 5000,
        authenticationTimeout: 10000,
      },
    },
  } as MicroserviceOptions);
  const config = new DocumentBuilder()
    .setTitle('API STORE AND MARKET')
    .setDescription('The store and market API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.startAllMicroservices();
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
