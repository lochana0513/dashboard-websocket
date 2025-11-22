import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketController } from './market.controller';
import { DashboardMarketService } from './services/dashboard-market.service';
import { MarketValue, MarketValueSchema } from './schemas/dashboard-market.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MarketValue.name, schema: MarketValueSchema }])],
  controllers: [MarketController],
  providers: [DashboardMarketService],
  exports: [DashboardMarketService],
})
export class MarketModule {}
