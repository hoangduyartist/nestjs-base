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

  async findByEmail(email): Promise<User> {
    return this.userModel.findOne({
      email: email?.toLowerCase(),
    })
  }

  async create(createUserDto): Promise<User> {
    if (await this.findByEmail(createUserDto?.email)) {
      throw new Error('Email already exists')
    }
    const merchantUsr = {
      ...createUserDto,
      email: createUserDto?.email?.toLowerCase(),
      account_name: createUserDto?.email?.split('@')?.[0]?.toLowerCase()
    };
    const createdUser = new this.userModel(merchantUsr);
    return createdUser.save();
    // return this.userModel.create(createUserDto);
  }

  // getTest() {
  //   // console.log('get env', this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2'))
  //   return this.configService.get<string>('STRIPE_SECRET', 'STRIPE_SECRET_2');
  //   // return 'abc'
  // }
  async findByAccName(accName: string): Promise<User> {
    return this.userModel.findOne({ account_name: accName?.toLowerCase() })
  }

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
    .where('stripe_customer_id').equals(null)
    if (!userByEmail) throw new Error('User by email not found or exist tripe-id')
    // return userByEmail
    const newStripeCustomer = await this.stripeService.createCustomer(name, email);
    // return newStripeCustomer;
    return this.update(userByEmail?._id,{ stripe_customer_id: newStripeCustomer?.id })
  }

  async getStripeUsers() {
    return this.stripeService.getCustomers()
  }

  async getStripeUserByEmail(email) {
    const stripeCustomerId = await this.userModel.findOne({ email }).select(['stripe_customer_id'])
    return this.stripeService.getCustomerById(stripeCustomerId?.stripe_customer_id)
  }
}
