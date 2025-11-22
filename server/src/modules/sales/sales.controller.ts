import { Controller, Get, Query } from '@nestjs/common';
import { DashboardSalesService } from '../sales/services/dashboard-sales.service';
import { GetSalesChartDto, GetSalesTotalDto } from '../sales/dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly dashboardSalesService: DashboardSalesService) {}

  @Get('monthly-chart')
  getMonthlySales(@Query() query: GetSalesChartDto) {
    return this.dashboardSalesService.getMonthlySales(query);
  }

  @Get('total')
  getTotalSales(@Query() query: GetSalesTotalDto) {
    return this.dashboardSalesService.getTotalSales(query);
  }
}
