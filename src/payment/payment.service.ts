import { Injectable } from '@nestjs/common';

import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    private stripeService: StripeService
  ) { }

  async createPayment() {
    return this.stripeService.createCharge({
      amount: 200,
      currency: 'aud',
      source: 'card_1KqV1YBlmwayZ8P46zRrKCys',
      description: 'My Test Charge for stripe-2',
      customer: 'cus_LXa9PwTWzQvskc'
    })
  }
}
