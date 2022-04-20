import { Controller, Get, Post, Put, Delete, HttpStatus, HttpException, Req, Res, Body, Param } from '@nestjs/common';
import { Request, Response } from 'express';
// srv
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) { }

  @Get()
  // findAllTest(@Req() req: Request, @Res() res: Response) {
  //   // return 'Return all cats';
  //   res.status(HttpStatus.OK).json({
  //     msg: 'Return all cats'
  //   })
  // }
  async findAll(@Req() req: Request, @Res() res: Response) {
    // throw new HttpException('Forbidden msg', HttpStatus.FORBIDDEN);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      msg: 'Return all cats',
      data: await this.catsService.findAll(),
    })
  }

  @Post()
  async create(@Body() createCatDto, @Res() res) {
    // return await this.catsService.create(createCatDto);
    return res.status(HttpStatus.OK).json({
      data: {
        statusCode: HttpStatus.OK,
        created: await this.catsService.create(createCatDto)
      }
    })
  }

  @Get('/:id')
  async findById(@Res() response, @Param('id') id) {
    const cat = await this.catsService.findById(id);
    return response.status(HttpStatus.OK).json({
      data: {
        statusCode: HttpStatus.OK,
        cat
      }
    })
  }

  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() catInfo) {
    const updatedCat = await this.catsService.update(id, catInfo);
    return response.status(HttpStatus.OK).json({
      data: {
        statusCode: HttpStatus.OK,
        updated: updatedCat
      }
    })
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    try {
      const deletedCat = await this.catsService.delete(id);
      return response.status(HttpStatus.OK).json({
        data: {
          statusCode: HttpStatus.OK,
          deleted: deletedCat
        }
      })
    } catch (error) {
      throw new HttpException('[Internal server error]: ' + error?.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
