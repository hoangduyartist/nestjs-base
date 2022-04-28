import { ApiProperty } from "@nestjs/swagger";

// class InvoiceLineItem {
//   @ApiProperty({ default: 100 })
//   amount: number;

//   @ApiProperty({ default: 'aud' })
//   currency: string;

//   metadata?: Object;
// }

// class InvoiceLines {
//   @ApiProperty({ default: 'list' })
//   object: string;
//   @ApiProperty({
//     type: [InvoiceLineItem],
//     // default: [ { price: 'price_xx', quantity: 1 } ]
//   })
//   data: Array<InvoiceLineItem>
// }

class InvoiceProduct {
  @ApiProperty({ required: true, default: 'Product name' })
  name: string;
  @ApiProperty({ default: '' })
  description?: string;
  @ApiProperty({ required: true, default: 1 })
  quantity: number;
  @ApiProperty({ required: true, default: 100 })
  price: number;
  @ApiProperty({ required: true, default: 'aud' })
  currency: string;
}

class Invoice {
  customer: string;
  collection_method: string;
  days_until_due: number;
  description?: string;
  metadata?: Object;
}

class CreateInvoice extends Invoice {
  @ApiProperty({ required: true, default: 'cus_xxx' })
  customer: string;
  // allow create draft
  @ApiProperty({ default: 'exclude' })
  pending_invoice_items_behavior: string
  @ApiProperty({ default: 'send_invoice' })
  collection_method: string;
  @ApiProperty({ default: 2 })
  days_until_due: number;
  @ApiProperty({ default: 'description' })
  description?: string;
  @ApiProperty({ default: { customer_email: 'xxx@mailinator.com' } })
  metadata?: Object;
}

export class CreateInvoiceDto {

  @ApiProperty({
    type: [InvoiceProduct],
    // default: [ { price: 'price_xx', quantity: 1 } ]
  })
  products: Array<InvoiceProduct>

  @ApiProperty({ type: CreateInvoice })
  invoice: CreateInvoice

  // not work
  // @ApiProperty({ type: InvoiceLines })
  // lines: InvoiceLines;
}