import { Module } from '@nestjs/common';
import { DashboardGateway } from './dashboard.gateway';
import { MarketModule } from '../market/market.module';
import { SalesModule } from '../sales/sales.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [MarketModule, SalesModule, ChannelsModule],
  providers: [DashboardGateway],
})
export class DashboardModule {}
