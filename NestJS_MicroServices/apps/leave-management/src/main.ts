import { NestFactory } from '@nestjs/core';
import { LeaveManagementModule } from './leave-management.module';
import { RmqService } from "@app/common";

async function bootstrap() {
  const app = await NestFactory.create(LeaveManagementModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.enableCors({
    //Add your origins here
    origin: "http://localhost:5173",
  });
  await app.listen(3004);
}
bootstrap();
