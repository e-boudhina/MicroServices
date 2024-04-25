import { Controller, Get, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class EmailController {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly emailService: EmailService,
    private readonly rmqService: RmqService
    ) {}


  @MessagePattern({ cmd: 'send_create_user_email' })
  async sendUserCreationEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    //acknlewadge that the message is recived and remove it from the queue
    this.logger.log('Payload recieved');
    //console.log(data);

    //const messagePayload = context.getMessage();
    //console.log("Context recieved");
    //console.log(messagePayload);

    this.rmqService.ack(context);
    const res = await this.emailService.sendNewUserWithRoleEmail(data.newUser, data.rawGenatedPwd);
    this.logger.log(res.message);
    return res;
  }
  @MessagePattern({ cmd: 'send_reset_password_email' })
  async sendResetPasswordEmail(@Payload() user: any, @Ctx() context: RmqContext) {
    //acknlewadge that the message is recived and remove it from the queue
    this.logger.log('Payload recieved');
    //console.log(user);

    this.rmqService.ack(context);
    const res = await this.emailService.sendResetPasswordEmail(user);
    this.logger.log(res.message);
    return res;
  }




}
