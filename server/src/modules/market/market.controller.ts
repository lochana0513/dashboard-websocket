import { Controller, Get } from '@nestjs/common';
import { DashboardMarketService } from '../market/services/dashboard-market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly dashboardMarketService: DashboardMarketService) {}

  @Get('latest')
  getLatest() {
    return this.dashboardMarketService.getLatest();
  }
}
