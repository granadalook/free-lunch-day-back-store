import { Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { StoreController } from './controller/store.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          subscribe: {
            fromBeginning: true,
          },
          consumer: { groupId: 'kafka-test' },
          client: {
            ssl: true,
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
      },
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
