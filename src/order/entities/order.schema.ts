import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order {

  // @Prop()
  // _id: ObjectId;

  @Prop()
  status: string;

  @Prop()
  total_price: number;
  @Prop()
  currency: string;

  @Prop()
  payment_link_id: string;
  @Prop()
  payment_link: string;

  @Prop()
  customer_email: string;

  @Prop({ required: true })
  merchant_id: string;

  @Prop()
  stripe_payment_intent_id: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);