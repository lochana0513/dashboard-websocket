import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from '../schemas/dashboard-channels.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class DashboardChannelsService implements OnModuleInit {
  private readonly logger = new Logger(DashboardChannelsService.name);
  constructor(
    @InjectModel(Channel.name)
    private channelModel: Model<Channel>,
  ) {}

  async onModuleInit() {
    const count = await this.channelModel.countDocuments();

    if (count === 0) {
      await this.seedDummyChannels();
      this.logger.log('Seeded initial channel data.');
    }
  }

  async seedDummyChannels() {
    const dummy = [
      {
        source: 'Github',
        visitors: 2400,
        revenue: 3877,
        sales: 267,
        conversion: 4.7,
        iconKey: 'github',
      },
      {
        source: 'Facebook',
        visitors: 2200,
        revenue: 3426,
        sales: 249,
        conversion: 4.4,
        iconKey: 'facebook',
      },
      {
        source: 'Google Organic',
        visitors: 2000,
        revenue: 2444,
        sales: 224,
        conversion: 4.2,
        iconKey: 'google',
      },
      {
        source: 'Vimeo',
        visitors: 1900,
        revenue: 2236,
        sales: 220,
        conversion: 4.2,
        iconKey: 'vimeo',
      },
      {
        source: 'IndieHackers',
        visitors: 1700,
        revenue: 2034,
        sales: 204,
        conversion: 3.9,
        iconKey: 'indiehackers',
      },
      {
        source: 'Twitter',
        visitors: 1500,
        revenue: 1830,
        sales: 180,
        conversion: 3.5,
        iconKey: 'twitter',
      },
    ];

    await this.channelModel.insertMany(dummy);
  }

  @Interval(2000)
  async updateChannelValues() {
    const channels = await this.channelModel.find();

    for (const ch of channels) {
      // random increments
      ch.visitors += Math.floor(Math.random() * 5);
      ch.sales += Math.floor(Math.random() * 3);
      ch.revenue += Math.floor(Math.random() * 15);

      // recalc conversion
      ch.conversion = Number(((ch.sales / ch.visitors) * 100).toFixed(1));

      await ch.save();
    }
  }

  async getAllChannels() {
    return this.channelModel.find().sort({ visitors: -1 });
  }
}
