import { ApiProperty, ApiParam } from "@nestjs/swagger";

class OrderProduct {
  @ApiProperty({ required: true, default: 'Product name' })
  name: string;
  @ApiProperty({ default: '' })
  description?: string;
  @ApiProperty({ required: true, default: 1 })
  quantity: number;
  @ApiProperty({ required: true, default: 100 })
  price: number;
  // @ApiProperty({ required: true, default: 'aud' })
  // currency: string;
}

export class CreateOrderGroupDto {
  @ApiProperty({
    type: [OrderProduct],
    required: true
    // default: [ { price: 'price_xx', quantity: 1 } ]
  })
  products: Array<OrderProduct>
  
  @ApiProperty({ required: true, default: 'aud' })
  currency: string;
  // @ApiProperty({ required: true })
  merchant_account_name: string

  @ApiProperty({ default: 'tpcuser@gmail.com' })
  customer_email?: string
}