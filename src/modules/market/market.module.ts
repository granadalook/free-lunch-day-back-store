import { Module } from '@nestjs/common';
import { MarketService } from './service/market.service';
import { MarketController } from './controller/market.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from '../database/service/database.service';

@Module({
  imports: [HttpModule],
  controllers: [MarketController],
  providers: [MarketService, DatabaseService],
})
export class MarketModule {}
