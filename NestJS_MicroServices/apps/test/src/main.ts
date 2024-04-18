import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { EurekaService } from './eureka.service';


async function bootstrap() {
 

  /*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TestModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'test_queue', // Queue name
      queueOptions: {
        durable: false, // Set to true if you want the queue to survive broker restarts
      },
    },
  });
  
  await app.listen(); // Listen to the RMQ microservice
  
  console.log(`Test app is running`);
  */
 /*
  const app = await NestFactory.create(TestModule);
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
console.log(`amqp://${USER}:${PASSWORD}@${HOST}`);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions:{
        durable: true, // keep data between restarts
      },
    }
  });
  */
  const app = await NestFactory.create(TestModule);
  const eurekaService = app.get(EurekaService);
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

  const rmqService = app.get<RmqService>(RmqService); //  I don't get the syntax
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('TEST'));
  await app.startAllMicroservices();
 
}
bootstrap();
