import { NestFactory } from '@nestjs/core';
import { OrderMissionModule } from './order-mission.module';
import { RmqService } from "@app/common";
import { RmqOptions } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(OrderMissionModule);
  const rmqService = app.get<RmqService>(RmqService); //  I don't get the syntax
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH'));
  // Example CORS configuration
  app.enableCors({
    //Add your origins here
    origin: "http://localhost:5173",
  });
  await app.listen(3001);
}
bootstrap();
