import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.schema';
import { OrderDetail, OrderDetailSchema } from './entities/order-detail.schema';

import { OrderController } from './order.controller';

import { OrderService } from './order.service';
import { StripeService } from '../stripe/stripe.service';
import { UserService } from '../user/user.service';
// module
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderDetail.name, schema: OrderDetailSchema },
    ]),
    UserModule
  ],
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}