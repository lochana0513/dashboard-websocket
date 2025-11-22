import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DashboardMarketService } from '../market/services/dashboard-market.service';
import { DashboardSalesService } from '../sales/services/dashboard-sales.service';
import { DashboardChannelsService } from '../channels/services/dashboard-channels.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'dashboard',
})
@Injectable()
export class DashboardGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DashboardGateway.name);

  constructor(
    private readonly marketService: DashboardMarketService,
    private readonly salesService: DashboardSalesService,
    private readonly channelsService: DashboardChannelsService,
  ) {}

  afterInit() {
    this.logger.log('Dashboard WebSocket Gateway Initialized');
  }

  @Interval(1000)
  async pushMarketValue() {
    const latest = await this.marketService.getLatest();
    if (!latest) return;

    this.server.emit('market:update', latest);
  }

  @Interval(1000)
  async pushTotalSales() {
    const products = ['AcmeProfessional', 'AcmeAdvanced', 'AcmePlus'];

    for (const productType of products) {
      const totalSales = await this.salesService.getTotalSales({ productType });
      this.server.emit(`sales:total:${productType}`, totalSales);
    }

    this.logger.log('Pushed total sales for all products');
  }

  @Interval(1000)
  async pushMonthlySales() {
    const products = ['AcmeProfessional', 'AcmeAdvanced', 'AcmePlus'];

    for (const productType of products) {
      const monthlySales = await this.salesService.getMonthlySales({ productType });
      this.server.emit(`sales:monthly:${productType}`, monthlySales);
    }

    this.logger.log('Pushed monthly sales for all products');
  }

  @Interval(1000)
  async pushChannelMetrics() {
    const channels = await this.channelsService.getAllChannels();

    const payload = channels.map((channel) => ({
      source: channel.source,
      visitors: channel.visitors,
      revenue: channel.revenue,
      sales: channel.sales,
      conversion: channel.conversion,
    }));

    this.server.emit('channels:update', payload);

    this.logger.log('Pushed channel metrics');
  }
}
