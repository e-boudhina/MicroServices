import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { EurekaService } from './eureka.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  const eurekaService = app.get(EurekaService);
  const configService = app.get(ConfigService);
 // Register with Eureka
 try {
  await eurekaService.registerWithEureka();
} catch (error) {
  console.error('Error registering with Eureka:', error);
}
// Call the deregisterFromEureka method when the application is shutting down
const shutdownHandler = async () => {
  try {
    await eurekaService.deregisterFromEureka();
    //This line must be added or else you will not be able to register again since server is till listening
    
  } catch (error) {
    console.error('Error deregistering from Eureka:', error);
  } finally {
    //using process.on overrides default behavior of nest js. Therefor, nest give you the manual controle the moment you write it.
    // This is done because nest does not know that you need to close down eurka, hence you need to close both manually!
    await app.close(); // Close the Nest.js application
  }
  
};

process.on('SIGINT', shutdownHandler); // Listen for SIGINT signal (Ctrl+C)
process.on('SIGTERM',  shutdownHandler); // Listen for SIGTERM signal

  //Instantiaing rabbitmq service
  const rmqService = app.get<RmqService>(RmqService);
  const emailQueueName = configService.get<string>('RABBITMQ_EMAIL_QUEUE');

  //Setting reception queue name
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(emailQueueName));
  await app.startAllMicroservices();
}
bootstrap();
