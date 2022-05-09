import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    required: true,
    default: 'tpuserx@mailinator.com',
  })
  email: string

  @ApiProperty({ default: 'tpuser_full_name' })
  customer_email?: string
}