import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  stripeCustomerId: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);