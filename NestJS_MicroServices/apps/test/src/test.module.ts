import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { User } from './users/entities/user.entity';
import { EurekaService } from './eureka.service';

@Module({
  imports: [  ConfigModule.forRoot({isGlobal: true, envFilePath: './apps/test/.env'}), TypeOrmModule.forFeature([User]), RmqModule, DatabaseModule],
  controllers: [TestController],
  providers: [TestService, EurekaService],
})
export class TestModule {}
