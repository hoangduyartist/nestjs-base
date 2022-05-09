import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true, get: v => v?.toString() })
  _id: string
  
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  account_name: string;

  @Prop()
  stripe_customer_id: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);