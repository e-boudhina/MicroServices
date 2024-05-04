import { Body, Injectable, Post, HttpStatus, HttpCode, InternalServerErrorException, Res, HttpException, ConflictException, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { MailService } from '../mail/mail.service';
import { EMAIL_SERVICE } from '../common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { exit } from 'process';
import { UserDto } from './dto/return-user.dto';


const setTimeoutPromise = promisify(setTimeout);
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';

  /*
  This approach uses the @InjectRepository decorator from the @nestjs/typeorm module.
  It automatically injects a repository for the specified entity (User in this case) into the entityManager property.
  With this setup, you have access to methods provided by the repository, allowing you to perform database operations specific to the User entity easily.
*/
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    //private readonly mailService: MailService,
    @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy
    //private readonly entityManager: EntityManager,
    //private readonly logger = new Logger()
    ){};

  //what about sync do you need ot put it or is it by default sync?
  //whhy do I need a promise
  async createUser( userDTO: CreateUserDto): Promise <any>{
    try{
        
        //Checking if a user exists with that email
        const existingUser = await this.usersRepository.findOneBy({ email: userDTO.email });

        if (existingUser) {
            //console.log('Email already exists');
          // Email already exists, throw a custom exception
          throw new HttpException('Email already exists!', HttpStatus.CONFLICT);
        }
        
        //Hashing password
        //console.log("password = "+userDTO.password)
        const rawGenatedPwd = this.generateRandomPassword();
        //console.log('generated pwd'+rawGenatedPwd);
        const pwdHash = await this.hashData(rawGenatedPwd);
        //validation is being done on the DTO but you can also do it here if you want to

        //console.log(hash);
        // Fetching use role:
        //you can make this dynmaic by sending the key value of the role and adding pulling it from the user object here
        const userRole = await this.rolesRepository.findOneBy({ name: "user" });
    
        //Be carefull "create" fn is only creating and instance, you need the save to persist it in the database
        //add exception here to manage role not found
        const newUser = await this.usersRepository.save({
                email: userDTO.email,
                password: pwdHash,
                role_id: userRole
        });
        // Check if the user was added successfully
        if (!newUser) {
          throw new HttpException('Failed to create user!', HttpStatus.BAD_REQUEST);
        }
        //Success
        //Notify user via email
        //figure out a way on how 2 send 2 return to the front end ( user created + user notified)
        this.logger.log('Sending User Created Email Payload...');
        //this.mailService.sendNewUserWithRoleEmail(newUser, rawGenatedPwd).then((res)=> console.log(res)); 
        const response = await lastValueFrom(this.emailService.send({ cmd: 'send_create_user_email' }, {newUser, rawGenatedPwd})); 
        this.logger.log(response.message);
        return response;

        //Only for signup - not needed here
        /* 
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
        */
    }catch(error){
        console.log(error);
        //console.log('Caught exception status code: ', error.getStatus());
        //throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        // throw new HttpException(error.message, error.status);
       
        if (error instanceof HttpException) {
            // If it's already an HttpException, rethrow it directly
            throw error;
        } else{
            throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
      

    }
    //it's returning 500, how can it know email exists and I did not treat that case
}

  async getAllUsers(): Promise<any> {
    try{
      return await this.usersRepository.find({
        select: ['id', 'username', 'email',   'disabled', 'role_id'],
      }

      );
      
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
       console.log("finde one by after");
      }
    }catch(error){
      throw new InternalServerErrorException('User creation failed!');
    }
  }

  async getAuthenticatedUser(id: number):  Promise<any> {
    try{
      const retrievedUser= await this.usersRepository.findOneBy({id});
      if (retrievedUser) {
        const { id, username, email, role_id } = retrievedUser;
        const user = {
          id,
          username,
          email,
          role: role_id.name // Rename the property to "role"
        };
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
      
      const result = await this.findOneBy(id);
      console.log(result);
      if(result instanceof(User)){
        //console.log("updating");
        //console.log(result);
       // console.log(updateUserDto);
       // console.log("Feres"+updateUserDto.role_id);
        //checking if role exists:
        /* type orm errors on hanling null value
        The behavior you're experiencing might be due to the fact that the findOneBy method
        you're using in your rolesRepository is not treating null as an absence of a condition.
        Instead, it's using the provided id: updateUserDto.role_id even when it's null,
        and it retrieves the first role with the specified id (which is your default role).
        */
       //If user sends user id field
        console.log("test ");
        const result3 = await this.usersRepository.update(id, updateUserDto);
        if(result3){
          return {
            message: `User with id ${id} update succssfully!`,
            //data: result2
          }; 
        }
        }else{
          return {
            message: result.message
          }
        }
      
    
    }catch(error){
      if (error instanceof HttpException) {
        // If it's already an HttpException, rethrow it directly
        throw error;
    }else{
      console.log(error);
      throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }
  }
  async removeUser(id: number) {
    try{
      console.log("here");
      const result = await this.findOneBy(id);
      console.log(result);

      if(result instanceof(User)){""
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

  async disableUserAccount(id: number) {
    const result = await this.findOneBy(id);
    //if result contains an error
    if(result.message){
      return result;
    }
    //if it does not contain an error than it must contain the user, so check instance type as a precaution
    if(result instanceof(User)){
      result.disabled=true;
      const res = await this.usersRepository.update(id, result);
      if(res.affected > 0){
        return {
          message: `Account has been disabled successfully`,
        };
      }
    }
  }

  async enableUserAccount(id: number) {
    const result = await this.findOneBy(id);
    //if result contains an error
    if(result.message){
      return result;
    }
    //if it does not contain an error than it must contain the user, so check instance type as a precaution
    if(result instanceof(User)){
      result.disabled=false;
      const res = await this.usersRepository.update(id, result);
      if(res.affected > 0){
        return {
          message: `Account is now active`,
        };
      }
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
