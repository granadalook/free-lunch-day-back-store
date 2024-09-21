import { Module } from '@nestjs/common';
import { MarketService } from './service/market.service';
import { MarketController } from './controller/market.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
