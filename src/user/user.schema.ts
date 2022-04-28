import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop()
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