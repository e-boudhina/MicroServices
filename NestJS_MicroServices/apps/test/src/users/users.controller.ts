import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, InternalServerErrorException, HttpException, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { get } from 'http';
import { Request } from "express";
import * as jwt from 'jsonwebtoken';
import { Public } from 'apps/auth/src/common/decorators/public.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  

  @Public()
  @Get()
  async getAllUsers(@Res() response) {

    try{
      const users = await this.usersService.getAllUsers(  );
    
        response.status(HttpStatus.ACCEPTED).send({
        users: users
      }); 
    
    }catch(error){
    
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      
        error: error.message,
      }); 
    }

  }

  @Public()
  @Get(':id')
  findOneBy(@Param('id') id: number) {
    return this.usersService.findOneBy(id);
  }



  @Public()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

}
