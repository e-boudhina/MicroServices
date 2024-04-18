import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queueName: string, noAck = false): RmqOptions {
    console.log(queueName);
    const USER = this.configService.get('RABBITMQ_USER');
    const PASSWORD = this.configService.get('RABBITMQ_PASS');
    const HOST = this.configService.get('RABBITMQ_HOST');
    const QUEUE = `RABBITMQ_${queueName}_QUEUE`;
    console.log("the quename is: "+QUEUE);
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        queue: QUEUE,
        //noAck it set to false by default meaning we need to maunally acknoledge that we have processed the message so that rabbit mq can take it off the queue and avoid replaying it
        noAck,
        queueOptions:{
          durable: true, // keep data in storage between restarts ( unlike transient which means store in the RAMM, if power is lost you lose it all)
        },
      },
    };
  }
  //In order to avoid repitiion this block of code should be put here and call it from the service you are using;
  ack(context: RmqContext) {
    //if you do nt write channel ack the message will remain saved in the queue until you manually deelete them or disable acknewledgment
    //This overrides the code in the rabbitmq file
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage(); // get message from context
    channel.ack(originalMessage);
  }
  
}
