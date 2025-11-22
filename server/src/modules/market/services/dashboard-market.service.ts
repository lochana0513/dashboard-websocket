import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketValue } from '../schemas/dashboard-market.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class DashboardMarketService {
  private readonly logger = new Logger(DashboardMarketService.name);

  constructor(
    @InjectModel(MarketValue.name)
    private marketModel: Model<MarketValue>,
  ) {}

  @Interval(1000)
  async generateMarketValue() {
    const value = this.randomMarketValue();
    await this.marketModel.create({
      value,
      timestamp: new Date(),
    });

    this.logger.log(`New Market Value: ${value}`);
  }

  @Interval(60000) // every minute
  async cleanupOldValues() {
    await this.marketModel.deleteMany({
      timestamp: { $lt: new Date(Date.now() - 60 * 60 * 1000) }, // keep last hour
    });
  }

  // Simple random value generator (modify as needed)
  private randomMarketValue(): number {
    return Number((50 + Math.random() * 20).toFixed(2)); // from 50 to 70
  }

  async getLatest() {
    return this.marketModel.findOne().sort({ timestamp: -1 }).exec();
  }
}
