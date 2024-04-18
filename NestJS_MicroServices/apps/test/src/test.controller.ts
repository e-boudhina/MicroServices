import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly rmqService: RmqService
    ) {}

  @MessagePattern({ cmd: 'fetch_username' })
  async fetchUsername(@Ctx() context: RmqContext) {
    //acknlewadge that the message is recived and remove it from the queue
    this.rmqService.ack(context);
    console.log('QMQ test service reached v2')
    return this.testService.getUser();
  }
}
