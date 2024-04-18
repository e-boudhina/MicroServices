import { Body, Injectable, Post, HttpStatus, HttpCode, InternalServerErrorException, Res, HttpException, ConflictException } from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';



const setTimeoutPromise = promisify(setTimeout);
@Injectable()
export class UsersService {

  private readonly charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';

  /*
  This approach uses the @InjectRepository decorator from the @nestjs/typeorm module.
  It automatically injects a repository for the specified entity (User in this case) into the entityManager property.
  With this setup, you have access to methods provided by the repository, allowing you to perform database operations specific to the User entity easily.
*/
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    
    ){};

  //what about sync do you need ot put it or is it by default sync?
  //whhy do I need a promise


  async getAllUsers(): Promise<any> {
    try{
      return await this.usersRepository.find();
      
    }catch(error){
      throw new InternalServerErrorException('User creation failed!');
    }
  }

  async findOneBy(id: number):  Promise<any> {
    try{
      const user = await this.usersRepository.findOneBy({id});
      if (user) {
        return  user ;
      } else {
        return {
          message: `No registered user under the id ${id}!`
        };
      }
    }catch(error){
      throw new InternalServerErrorException('User creation failed!');
    }
  }

  

  
  async removeUser(id: number) {
    try{
      console.log("here");
      const result = await this.findOneBy(id);
      console.log(result);

      if(result instanceof(User)){
        console.log("deleting");
        const result2 = await this.usersRepository.remove(result);
        if(result2){
          return {
            message: `User with id ${id} removed succssfully!`,
            data: result2
          }; 
        }
      }else{
       return {
          message: result.message
       }
      }
      

    }catch(error){
      throw new InternalServerErrorException('Deletion failed');
    }

  }

  //Helper functions
  hashData(data: string){
    return bcrypt.hash(data, 10);
  }
  generateRandomPassword(): string {
    const length = 12; // Fixed length of 12 characters
    return Array.from({ length }, () => this.getRandomChar()).join('');
}

private getRandomChar(): string {
    const randomIndex = Math.floor(Math.random() * this.charset.length);
    return this.charset.charAt(randomIndex);
}
}
