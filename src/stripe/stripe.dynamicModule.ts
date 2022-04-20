import { Module, DynamicModule, Provider } from '@nestjs/common';
import { Stripe } from 'stripe';

@Module({})
export class StripeModule {
  static forRoot(secretKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(secretKey, config);

    const stripeProvider: Provider = {
      provide: 'STRIPE_CLIENT',
      useValue: stripe
    }

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true
    }
  }
}