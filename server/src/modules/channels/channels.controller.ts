import { Controller, Get } from '@nestjs/common';
import { DashboardChannelsService } from '../channels/services/dashboard-channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly dashboardChannelsService: DashboardChannelsService) {}

  @Get()
  async getAllChannels() {
    return this.dashboardChannelsService.getAllChannels();
  }
}
