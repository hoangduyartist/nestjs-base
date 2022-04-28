import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDetailDocument = OrderDetail & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class OrderDetail {

  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  stripe_price_product_id: string;

}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);