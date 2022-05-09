import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type ChargeDocument = Charge & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Charge {

  // @Prop()
  // _id: ObjectId;

  @Prop()
  status: string;

  @Prop()
  net: number;
  @Prop()
  amount: number;
  @Prop()
  fee: number;
  @Prop({ required: true })
  currency: string;
  @Prop({ required: true })
  available_on: string

  @Prop()
  stripe_charge_id: string;
  @Prop({ required: true })
  stripe_payment_intent_id: string;
  @Prop()
  stripe_balance_txn_id: string;

  @Prop()
  stripe_receipt_url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  order_id: string;

  @Prop({ required: true })
  source_customer_email: string;

  @Prop()
  merchant_id: string;

}

export const ChargeSchema = SchemaFactory.createForClass(Charge);