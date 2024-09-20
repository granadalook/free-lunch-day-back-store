import { Module } from '@nestjs/common';
import { MarketService } from './service/market.service';
import { MarketController } from './controller/market.controller';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
