import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RmqModule } from '@app/common';
import { EurekaService } from './eureka.service';


const mailDirecrtoryPath = join(process.cwd(), 'apps/email/src/');

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: './apps/email/.env'}),
    RmqModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          debug: true,
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<string>('MAIL_PORT'),
          //ignoretls: configService.get<string>('MAIL_IGNORE_TLS'),
          secureConnection: configService.get<string>('MAIL_SECURE_Connection'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
       
        },
        defaults: {
          from: `${configService.get<string>('MAIL_FROM')}`,
        },
        
        template: {
          
          dir: join(mailDirecrtoryPath , 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EurekaService],
})
export class EmailModule {}
