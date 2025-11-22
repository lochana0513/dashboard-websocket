import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { DashboardSalesService } from './services/dashboard-sales.service';
import { SalesHistory, SalesHistorySchema } from './schemas/dashboard-sales.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SalesHistory.name, schema: SalesHistorySchema }])],
  controllers: [SalesController],
  providers: [DashboardSalesService],
  exports: [DashboardSalesService],
})
export class SalesModule {}
