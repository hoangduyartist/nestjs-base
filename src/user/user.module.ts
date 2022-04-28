import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';

import { UserService } from './user.service';
import { StripeService } from '../stripe/stripe.service';
// module
// import { StripeModule } from '../stripe/stripe.dynamicModule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // StripeModule.forRoot('sk_test_51KqBi5BlmwayZ8P42BtxJwQkh3Z0pq3mXSvg1IpPcHqIIoCLajWUZGLA4g41PQSQmzRogECgskgVzDkEk7yzLZap00PaIepb00', { apiVersion: '2020-08-27' })
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, StripeService],
})
export class UserModule {}