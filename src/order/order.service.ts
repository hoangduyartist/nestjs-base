import { Model, startSession } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// schema
import { Order, OrderDocument } from './entities/order.schema';
import { OrderDetail, OrderDetailDocument } from './entities/order-detail.schema';
// import { UserDocument } from 'src/user/user.schema';
// dto
import { CreateOrderGroupDto } from './dto/create-order.dto';
// srv
import { UserService } from 'src/user/user.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderDetail.name) private orderDetailModel: Model<OrderDetailDocument>,

    private userService: UserService,
    private stripeService: StripeService,
  ) {}

  async createOrder(props) {

  }

  async createGroup(props: CreateOrderGroupDto): Promise<any> {
    const merchantUser = await this.userService.findByAccName(props.merchant_account_name);
    if (!merchantUser) throw new Error('User not found');
    // test
    // const pmLink = await this.stripeService.getStripeInstance().paymentLinks.retrieve("plink_1Kt8S7BlmwayZ8P47Ll4jY1y")
    // return { pm_link_detail: pmLink }
    // const checkoutSS = await this.stripeService.getStripeInstance().checkout.sessions.retrieve('cs_test_a1IWsOrieC00wWRk79RFfmSVSRgHjIbbiDrWFpz4ig5VvUpl0AyBweN9qr')
    // return { checkoutSS }
    // const paymentIn = await this.stripeService.getStripeInstance().paymentIntents.retrieve('pi_3Kt6fxBlmwayZ8P41m6j4VLp')
    // return { paymentIn }
    // const txn = await this.stripeService.getStripeInstance().balanceTransactions.retrieve('txn_3KtNnuBlmwayZ8P41R0NsyeA')
    // return txn
    // test
    const dollarToCent = (dollar: number) => dollar * 100; 
    const centToDollar = (cent: number) => cent / 100; 
    const customerEmail = props.customer_email;
    const currencyCode = props.currency;
    // create price-product
    const listProducts = [...props.products]
    const [...stripeNewPrices] = await Promise.all([
      ...listProducts.map((pr) => {
        return this.stripeService.createPriceWithProduct({
          "unit_amount_decimal": dollarToCent(pr?.price),
          "currency": currencyCode || 'aud',
          "billing_scheme": "per_unit",
          // "expand": [
          //   "product",
          //   "product.prices",
          //   "tiers"
          // ],
          "product_data": {
            "name": pr.name,
            "metadata": { description: pr.description }
          },
          "metadata": {
            techpay_merchant_id: merchantUser?._id,
            customer_email: customerEmail
          }
        })
      })
    ]);
    // create payment link
    let paymentLinkLineItems = {};
    stripeNewPrices?.map((pr, i) => {
      paymentLinkLineItems[i] = {
        price: pr.id,
        quantity: listProducts[i].quantity
      }
    })
    // console.log('merchantUser', merchantUser);
    const newStripePaymentLink = await this.stripeService.createPaymentLink({
      "line_items": paymentLinkLineItems,
      "metadata": {
        techpay_merchant_id: merchantUser?._id,
        customer_email: customerEmail
      }
    })
    const responsePaymentLink = {
      id: newStripePaymentLink.id,
      object: newStripePaymentLink.object,
      active: newStripePaymentLink.active,
      after_completion: newStripePaymentLink.after_completion,
      metadata: newStripePaymentLink.metadata,
      url: newStripePaymentLink.url,
      total_price: listProducts.reduce((a, b) => a + (b.price * b.quantity), 0),
      currency: currencyCode
    }
    // save in techpay db
    const newOrder = new this.orderModel({
      status: 'active',
      total_price: responsePaymentLink?.total_price,
      currency: responsePaymentLink?.currency,
      payment_link_id: responsePaymentLink.id,
      payment_link: responsePaymentLink.url,
      customer_email: responsePaymentLink.metadata?.customer_email,
      merchant_id: responsePaymentLink.metadata?.techpay_merchant_id
    });
    // const session = await startSession();
    await newOrder.save()
    .then((order) => {
      this.orderDetailModel.insertMany(
        stripeNewPrices.map(pr => ({
          stripe_price_product_id: pr.id,
          order_id: order?._id
        })),
        // { session }
      )
    })
    // .then(() => session.commitTransaction())
    .catch(err => {
      console.log('[order service]', err)
      // session.abortTransaction();
      throw new Error('Save order failed')
    })

    return { 
      payment_link: {...responsePaymentLink},
      original_payment_link: {...newStripePaymentLink},
      // merchantUser, listProducts
    }
  }

  async deactivatedOrderByPaymentLinkId(pmlId) {
    return this.orderModel.findOneAndUpdate({ payment_link_id: pmlId }, { status: 'paid' })
  }

  async updateOneByKey(key, valueKey, updateProps) {
    return this.orderModel.findOneAndUpdate({
      [key]: valueKey
    }, {
      ...updateProps
    })
  }
}

