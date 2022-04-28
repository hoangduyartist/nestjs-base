// docs
// https://stripe.com/docs/api/customers/create
// https://stripe.com/docs/payments?payments=popular
// https://dashboard.stripe.com/test/
// setup
// https://wanago.io/2021/06/14/api-nestjs-stripe-react/
// https://www.youtube.com/watch?v=JTGgYVIBZjI
// active
// https://dashboard.stripe.com/account/onboarding/business-structure

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
 
@Injectable()
export class StripeService {
  private stripe: Stripe;
 
  constructor(
    private configService: ConfigService
  ) {
    // this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2'), {
      apiVersion: '2020-08-27',
    });
  }

  getStripeInstance() {
    return this.stripe;
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email
    });
  }

  async getCustomers() {
    return this.stripe.customers.list()
  }

  async getCustomerById(stripeCustomerId) {
    return this.stripe.customers.retrieve(stripeCustomerId)
  }

  async createCharge(props) {
    const { amount, currency, source, description, customer } = props;
    return this.stripe.charges.create({
      amount,
      currency,
      source,
      description,
      customer
    })
  }

  async deletePaymentLink(payment) {

  }

  async createInvoice(props) {
    // const { customer, description, metadata } = props;

    return this.stripe.invoices.create(props)
  }

  // order - price prod - payment_link
  async createPaymentLink(props) {
    // const { line_items, metadata } = props;

    return this.stripe.paymentLinks.create({
      ...props
    })
  }

  async createPriceWithProduct (props) {
    return this.stripe.prices.create(props)
  }

  async deactivatePaymentLink (paymentLinkId) {
    return this.stripe.paymentLinks.update(
      paymentLinkId,
      { active: false }
    )
  }
  // order - price prod - payment_link
}