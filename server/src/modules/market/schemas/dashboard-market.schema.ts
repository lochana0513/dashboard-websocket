import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MarketValue extends Document {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  timestamp: Date;
}

export const MarketValueSchema = SchemaFactory.createForClass(MarketValue);
