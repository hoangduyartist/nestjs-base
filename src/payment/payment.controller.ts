import { Body, Controller, Post, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
// srv
import { PaymentService } from './payment.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
// dto
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Post('/create')
  async createPayment(@Req() req: Request, @Res() res: Response) {
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

  @Post('/create/payment-link')
  async createPaymentLink(@Body() body: CreatePaymentLinkDto, @Req() req: Request, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          created: await this.paymentService.createPaymentLink(body)
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('/create/invoice')
  async createInvoice(@Body() body: CreateInvoiceDto, @Req() req: Request, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          created: await this.paymentService.createInvoice(body)
        }
      })
    } catch (error) {
      console.log('ROUTE - ERR', error)
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('/webhook')
  async listeningStripeEvents(@Body() body, @Req() req: Request, @Res() res: Response) {
    
    try {
      const sig = req.headers['stripe-signature'];
      const handleWebhookRes = await this.paymentService.handleStripeWebhookResponse(sig, req, JSON.parse(req?.body));
      console.log('[payment ctrl - /webhook]', handleWebhookRes)
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          stripeRes: handleWebhookRes
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
