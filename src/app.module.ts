import { Module } from '@nestjs/common';
import { MarketModule } from './modules/market/market.module';
import { StoreModule } from './modules/store/store.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            ssl: true,
            sasl: {
              mechanism: 'plain',
              password:
                'W7ioyLOGFtVX9rsHNO5t0xNpDOW6kSHJbEB1iHxjM5SOJamALqFnvvW1/P8nWfP4',
              username: 'SLTOY7I7LP5OB2VW',
            },
            brokers: ['pkc-4j8dq.southeastasia.azure.confluent.cloud:9092'],
          },
        },
      },
    ]),
    StoreModule,
    MarketModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
