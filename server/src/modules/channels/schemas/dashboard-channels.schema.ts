import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Channel extends Document {
  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  visitors: number;

  @Prop({ required: true })
  revenue: number;

  @Prop({ required: true })
  sales: number;

  @Prop({ required: true })
  conversion: number;

  @Prop({ required: true })
  iconKey: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
