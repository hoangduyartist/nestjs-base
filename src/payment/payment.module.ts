import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeService } from '../stripe/stripe.service';

import { OrderModule } from 'src/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
// schema
import { Charge, ChargeSchema } from './entities/charge.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Charge.name, schema: ChargeSchema }]),
    OrderModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService]
})
export class PaymentModule {}
