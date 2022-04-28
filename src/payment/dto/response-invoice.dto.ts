import { ApiProperty } from "@nestjs/swagger";

export class Invoice {
  // @ApiProperty({  })
  id: string;
  object: string;
  status: string;
  // customer: string;
  customer_email: string;
}