import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import "reflect-metadata";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import { EurekaService } from './eureka.service';


async function bootstrap() {
  /*
  const app = await NestFactory.createMicroservice(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  */

  
 //await app.listen(4200);
//  console.log(`Auth app is running on port ${await app.getUrl()}`);

/*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
  */
 
  /*
  const app = await NestFactory.create(AuthModule);
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
  await app.startAllMicroservices();
*/
  
const app = await NestFactory.create(AuthModule);
 // Add CORS middleware to allow requests from 'http://localhost:5173'

app.useGlobalPipes(new ValidationPipe());
setupSwagger(app);
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

// calling cookie parser
app.use(cookieParser());


await app.startAllMicroservices();

await app.listen(3000);
  // Constructing the log message with a star and formatting

  const message = `Server is listening on: ${await app.getUrl()}`;

  const stars = ' *'.repeat(message.length); // Adding 4 for padding

  // Logging the message with stars 0for emphasis using the Nest.js logger
  Logger.log(stars);
  Logger.log(`* ${message} *`,  'Auth-application');
  Logger.log(stars);
  

}
bootstrap();
