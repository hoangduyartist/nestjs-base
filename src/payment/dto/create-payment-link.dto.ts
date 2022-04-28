import { ApiProperty } from "@nestjs/swagger";

class LineItemDto {
  @ApiProperty({ default: 'price_xxx' })
  price: string;

  @ApiProperty({ default: 1 })
  quantity: number
}

enum PaymentMethodType {
  card = 'card'
}

export class CreatePaymentLinkDto {
  @ApiProperty({
    type: [LineItemDto],
    // default: [ { price: 'price_xx', quantity: 1 } ]
  })
  line_items: Array<LineItemDto>;

  @ApiProperty({ default: { merchant_email: 'abc@mailinator.com' } })
  metadata: Object;

  @ApiProperty({ required: false, enum: ['card'] })
  payment_method_types: PaymentMethodType
}