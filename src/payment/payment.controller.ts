import { Body, Controller, Post, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
// srv
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Post('/create')
  async createPayment(@Body() Body, @Req() req: Request, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          created: await this.paymentService.createPayment()
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
