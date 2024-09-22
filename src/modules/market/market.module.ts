import { Module } from '@nestjs/common';
import { MarketService } from './service/market.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from '../database/service/database.service';

@Module({
  imports: [HttpModule],
  providers: [MarketService, DatabaseService],
})
export class MarketModule {}
