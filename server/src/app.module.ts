import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ChannelsModule } from './modules/channels/channels.module';
import { SalesModule } from './modules/sales/sales.module';
import { MarketModule } from './modules/market/market.module';
import { DatabaseModule } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ChannelsModule,
    SalesModule,
    MarketModule,
    DatabaseModule,
    DashboardModule,
  ],
})
export class AppModule {}
