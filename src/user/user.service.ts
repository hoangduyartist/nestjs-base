import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
// import { CreateUserDto } from './dto/create-cat.dto';
// srv
// import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // private configService: ConfigService,
    private stripeService: StripeService,
  ) {}

  async create(createUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
    // return this.userModel.create(createUserDto);
  }

  // getTest() {
  //   // console.log('get env', this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2'))
  //   return this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2');
  //   // return 'abc'
  // }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id, catInfo): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, catInfo)
  }

  async delete(id): Promise<any> {
    return this.userModel.findByIdAndRemove(id)
  }

  // stripe user
  async createStripeUser(name = 'Default name', email) {
    const userByEmail = await this.userModel.findOne({
      email,
      // stripeCustomerId: { $eq: null }
    })
    .where('stripeCustomerId').equals(null)
    if (!userByEmail) throw new Error('User by email not found or exist tripe-id')
    // return userByEmail
    const newStripeCustomer = await this.stripeService.createCustomer(name, email);
    // return newStripeCustomer;
    return this.update(userByEmail?._id,{ stripeCustomerId: newStripeCustomer?.id })
  }

  async getStripeUsers() {
    return this.stripeService.getCustomers()
  }

  async getStripeUserByEmail(email) {
    const stripeCustomerId = await this.userModel.findOne({ email }).select(['stripeCustomerId'])
    return this.stripeService.getCustomerById(stripeCustomerId?.stripeCustomerId)
  }
}
