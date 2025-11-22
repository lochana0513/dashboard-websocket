import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SalesHistory extends Document {
  @Prop({ required: true })
  date: Date; // e.g., "2025-01-01"

  @Prop({ required: true })
  value: number; // sales value

  @Prop({ required: true })
  productType: string; // 'Acme Professional' | 'Acme Advanced' | 'Acme Plus'
}

export const SalesHistorySchema = SchemaFactory.createForClass(SalesHistory);
