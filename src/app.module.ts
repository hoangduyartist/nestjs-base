import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CatsController } from './cats/cats.controller';
// config
import { ConfigModule } from '@nestjs/config';
// module
import { CatsModule } from './cats/cats.module';
import { UserModule } from './user/user.module';
// db
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot('mongodb://service:service@localhost:27017/nestjsdb?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
    CatsModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
