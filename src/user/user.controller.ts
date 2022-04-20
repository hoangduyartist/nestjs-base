import { Controller, Get, Post, Put, Delete, HttpStatus, HttpException, Req, Res, Body, Param, Inject, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
// srv
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // @Inject('STRIPE_CLIENT') private stripe: Stripe
    // private stripe: Stripe
  ) {}

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    // throw new HttpException('Forbidden msg', HttpStatus.FORBIDDEN);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      msg: 'Return all users',
      data: await this.userService.findAll(),
      // stripeDataTest: await this.userService.getStripeUsers()
    })
  }

  @Post()
  async create(@Body() createCatDto, @Res() res) {
    // return await this.userService.create(createCatDto);
    try {
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          created: await this.userService.create(createCatDto)
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/:id')
  async findById(@Res() response, @Param('id') id) {
    const user = await this.userService.findById(id);
    return response.status(HttpStatus.OK).json({
      data: {
        statusCode: HttpStatus.OK,
        user
      }
    })
  }

  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() catInfo) {
    const updatedUser = await this.userService.update(id, catInfo);
    return response.status(HttpStatus.OK).json({
      data: {
        statusCode: HttpStatus.OK,
        updated: updatedUser
      }
    })
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    try {
      const deletedUser = await this.userService.delete(id);
      return response.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          deleted: deletedUser
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // stripe
  @Get('/stripe/customers')
  async getStripeCustomers(@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      let customerData = null;
      if (query.email) {
        customerData = await this.userService.getStripeUserByEmail(query.email)
      } else {
        customerData = await this.userService.getStripeUsers()
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        msg: 'Return stripe customers',
        data: customerData,
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('/stripe/customers')
  async createStripeCustomer(@Body() body, @Req() req: Request, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        msg: 'Return new stripe customers',
        data: await this.userService.createStripeUser(body.name, body.email),
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // @Get('/stripe/customers')
  // async listCustomers(@Req() req: Request, @Res() res: Response) {

  //   try {
  //     return res.status(HttpStatus.OK).json({
  //       statusCode: HttpStatus.OK,
  //       msg: 'Return stripe customers',
  //       data: await this.stripe.customers.list(),
  //     })
  //   } catch (error) {
  //     throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }
}
