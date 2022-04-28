import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';
import { OrderService } from 'src/order/order.service';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './dto/response-invoice.dto';

import { Model, startSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Charge, ChargeDocument } from './entities/charge.schema';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private stripeService: StripeService,
    private orderService: OrderService,

    @InjectModel(Charge.name) private chargeModel: Model<ChargeDocument>
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

  async createPaymentLink(paymentLink) {
    // price_1KqXGaBlmwayZ8P4kpYGwBdD
    return this.stripeService.createPaymentLink(paymentLink)
  }

  // INVOICE
  async createInvoice(createInvoiceProps: CreateInvoiceDto) {
    // const testParams = {
    //   customer: 'cus_LXP9sJnidBG6hF',
    //   description: 'invoice test 2 - stripe usr 1',
    //   metadata: { customer_email: 'duy1@mailinator.com' }
    // }
    if (createInvoiceProps.products) {

    }
    const newInvoice = await this.stripeService.createInvoice(createInvoiceProps.invoice);

    return newInvoice;
  }
  // INVOICE

  // CHARGE
  async retrieveBalanceById(id) {
    return this.stripeService.getStripeInstance().balanceTransactions.retrieve(id);
  }
  async chargeCreate (stripeNewCharge) {
    const exchangedAmount = stripeNewCharge.amount * 0.01;
    const TECHPAY_CHARGE_FEE = 0.04;
    const createdCharge = new this.chargeModel({
      status: stripeNewCharge?.status,
      net: exchangedAmount - (exchangedAmount * TECHPAY_CHARGE_FEE),
      amount: exchangedAmount,
      fee: exchangedAmount * TECHPAY_CHARGE_FEE,
      currency: stripeNewCharge.currency,
      available_on: stripeNewCharge.available_on,
      stripe_charge_id: stripeNewCharge.id,
      stripe_payment_intent_id: stripeNewCharge.payment_intent,
      stripe_balance_txn_id: stripeNewCharge.balance_transaction,
      stripe_receipt_url: stripeNewCharge.receipt_url,
      source_customer_email: stripeNewCharge.billing_details?.email
    })

    return createdCharge.save();
  }
  async chargeUpdateOneByKey (key, valueKey, updateProps) {
    return this.chargeModel.findOneAndUpdate({
      [key]: valueKey
    }, {
      ...updateProps
    }) 
  }
  // END CHARGE

  async handleStripeWebhookResponse(signature, request, reqRawBody) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_ENDPOINT_SECRET');
    let event;
    const reqBody = request?.body;

    try {
      event = this.stripeService.getStripeInstance().webhooks.constructEvent(reqBody, signature, endpointSecret);
    } catch (err) {
      console.log('[srv - handleStripeWebhookResponse]', err)
      throw new Error('Get stripe webhook event failed' + err?.message)
    }
    
    let retriveEvent = { type: '' };
    retriveEvent.type = event.type;
    // console.log('[payment srv - stripe webhook event]', event);
    // Handle the event
    switch (event.type) {
      case 'payment_link.created':
        break;
      case 'charge.succeeded':
        console.log('[charge.succeeded]', event.type);
        const newCharge = event?.data?.object;
        const bTxn = await this.retrieveBalanceById(newCharge.balance_transaction)
        newCharge.available_on = bTxn.available_on;
        await this.chargeCreate(newCharge);

      case 'checkout.session.completed':
        console.log('[checkout.session.completed]', event.type);
        const stripePaymentLinkId = event?.data?.object?.payment_link;
        const stripe_payment_intent_id = event?.data?.object?.payment_intent;

        await this.stripeService.deactivatePaymentLink(stripePaymentLinkId);
        // update order in db
        const updatedOrder = await this.orderService.updateOneByKey('payment_link_id', stripePaymentLinkId, { status: 'paid', stripe_payment_intent_id })
        // await this.orderService.deactivatedOrderByPaymentLinkId(stripePaymentLinkId);
        await this.chargeUpdateOneByKey('stripe_payment_intent_id', stripe_payment_intent_id, { order_id: updatedOrder?._id, merchant_id: updatedOrder?.merchant_id })
      default: 
        console.log(`Unhandled event type ${event.type}`);
    }

    return retriveEvent;
  }
}
