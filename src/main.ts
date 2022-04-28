import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
//doc 1
// https://vntalking.com/nestjs-nodejs-framework-tuyet-voi-thay-the-expressjs.html
// https://helpex.vn/question/nestjs-cach-su-dung-bien-.env-trong-tep-mo-dun-ung-dung-chinh-de-ket-noi-co-so-du-lieu-60d2ebd3853e4fd7cbc99b97

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/payment/webhook', bodyParser.raw({type: 'application/json'}));

  const config = new DocumentBuilder()
    .setTitle('Api example')
    .setDescription('Api description')
    .setVersion('1.0')
    .addTag('swagger - tag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
