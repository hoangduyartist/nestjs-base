import { Controller, Get, Post, Put, Delete, HttpStatus, HttpException, Req, Res, Body, Param, Inject, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';

import { CreateOrderGroupDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @ApiParam({ name: 'merchant', required: true })
  @Post('/merchant-order/:merchant')
  async createOrderGroup(@Body() createDto: CreateOrderGroupDto, @Param('merchant') merchant, @Res() res: Response) {
    // return await this.userService.create(createCatDto);
    if (!merchant || createDto.products?.length < 1) {
      throw new Error('Invalid params')
    }
    const createProps = {
      ...createDto,
      merchant_account_name: merchant
    }
    try {
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          created: await this.orderService.createGroup(createProps)
          // createdRequestBody: createProps
        }
      })
    } catch (error) {
      console.log('[createOrderGroup err]:', error)
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}