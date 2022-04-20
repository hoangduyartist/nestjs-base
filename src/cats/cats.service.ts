import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './cats.schema';
// import { CreateCatDto } from './dto/create-cat.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    private configService: ConfigService
  ) {}

  async create(createCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  getTest() {
    // console.log('get env', this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2'))
    return this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2');
    // return 'abc'
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findById(id): Promise<Cat> {
    return this.catModel.findById(id).exec();
  }

  async update(id, catInfo): Promise<Cat> {
    return this.catModel.findByIdAndUpdate(id, catInfo)
  }

  async delete(id): Promise<any> {
    return this.catModel.findByIdAndRemove(id)
  }
}
