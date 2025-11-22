import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelsController } from './channels.controller';
import { DashboardChannelsService } from './services/dashboard-channels.service';
import { Channel, ChannelSchema } from './schemas/dashboard-channels.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }])],
  controllers: [ChannelsController],
  providers: [DashboardChannelsService],
  exports: [DashboardChannelsService],
})
export class ChannelsModule {}
