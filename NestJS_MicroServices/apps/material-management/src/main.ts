import { NestFactory } from '@nestjs/core';
import { MaterialManagementModule } from './material-management.module';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(MaterialManagementModule);
  const rmqService = app.get<RmqService>(RmqService); //  I don't get the syntax
  app.enableCors({
    //Add your origins here
    origin: 'http://localhost:5173',
  }); //order counts , cors must be enabled before app listen
  await app.listen(3002);
}
bootstrap();
