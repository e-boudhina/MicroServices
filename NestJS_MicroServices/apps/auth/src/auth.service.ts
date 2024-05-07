import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/entities/user.entity';
import { EntityManager, IsNull, Not, Repository, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';


import { MailService } from './mail/mail.service';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { Role } from './roles/entities/role.entity';
import { RoleType } from './roles/entities/roles.enum';
import { Request, Response } from 'express';
import { EMAIL_SERVICE } from './common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterUserDto } from './users/dto/register-user.dto';
import { register } from 'module';

interface ResetPasswordResponse {
    message: string;
    remainingTime?: number; // Add remainingTime as an optional property
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        //private readonly entityManager: EntityManager,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy
        ){}
    
    //Helper function
    hashData(data: string){
        return bcrypt.hash(data, 10);
    }
    //The info we want to put into the json web token
    async getTokens(userId: number, email: string, roleName: string): Promise <Tokens>{
        const [at, rt] = await Promise.all([
        this.jwtService.signAsync(
            //Access Token
            {
                sub: userId,
                email,
                roleName: roleName
            },
            {
                secret: 'at-secret',
                expiresIn: 60 * 15,
            },
        ),
        //Refresh Token
        this.jwtService.signAsync(
            {
                sub: userId,
                email,
            },
            {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 7,
            },
        ),

    ]);//End promise

    //console.log("access token: "+at+ " and refresh token: "+rt)
    //Return object
        return {
            access_token: at,
            refresh_token: rt,
        };
    }
    async updateRtHash(userId: number, rt: string): Promise <any> 
    {
        //console.log("user id to update"+userId)
        const hash = await this.hashData(rt);
        //If the name of the field to be updated is the same as the name you set your variable to then you write update(userId, { hashedRt})
        await this.usersRepository.update(userId, { hashedRt: hash });
    }

    async signIn(userDTO: RegisterUserDto): Promise<any>{
        try{ 
           
        const retrievedUser = await this.usersRepository.findOneBy({ email: userDTO.email });
        //console.log(retrievedUser);   
        if(!retrievedUser) throw new HttpException("Incorrect Credentials!", HttpStatus.UNAUTHORIZED);
        // the firt arggument is the plain text password, the second is the the hashed password in the database
        const passwordMatches = await bcrypt.compare(userDTO.password, retrievedUser.password);
        //console.log('here'+passwordMatches);
        if (!passwordMatches) throw new HttpException("Incorrect Credentials!", HttpStatus.UNAUTHORIZED);
        //console.log('gaaaaaaaaaaaaaaaaaa');
        //Generating tokens
        const tokens = await this.getTokens(retrievedUser.id, retrievedUser.email, retrievedUser.role_id.name);
        //console.log('here2');
        await this.updateRtHash(retrievedUser.id, tokens.refresh_token);
        const { id, username, email, role_id } = retrievedUser;
        const user = {
          id,
          username,
          email,
          role: role_id.name // Rename the property to "role"
        };
        return {
            tokens,
            user
        };

        }catch(error){
           
            if (error instanceof HttpException) {
                console.log('instance of');
                // If it's already an HttpException, rethrow it directly
                throw error;
            } else {
                console.log(error);
                // If it's not an HttpException, create a new one with a dynamic response
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async signUp( userDTO: RegisterUserDto): Promise <any>{
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
            const rawPwd = userDTO.password;
            //console.log('generated pwd'+rawGenatedPwd);
            const pwdHash = await this.hashData(rawPwd);
            //validation is being done on the DTO but you can also do it here if you want to
    
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
            this.logger.log('Sending User Registration Email Payload...');
            //this.mailService.sendNewUserWithRoleEmail(newUser, rawGenatedPwd).then((res)=> console.log(res)); 
            /*
            try to handle WARN [Server] An unsupported message was received. It has been negative acknowledged, so it will not be re-delivered. Pattern: {"cmd":"send_user_registration_email"}
            error when the the name of the method is not found
            */
            const response = await lastValueFrom(this.emailService.send({ cmd: 'send_user_registration_email' }, newUser)); 
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
   
    async logout(userId: number, req: Request, res: Response){
        try{
            //Checking if a user exists with that email
            const user = await this.usersRepository.findOneBy({ id: userId });
            //console.log('user found ');
            //res.clearCookie('access_token');
            //res.clearCookie('refresh_token');
             // Get all cookie names from the request
            const cookieNames = Object.keys(req.cookies);

            // Clear each cookie individually
            cookieNames.forEach(cookieName => {
            res.clearCookie(cookieName);
            });

            /*
            console.log(req.cookies);
            req.cookies = null;
            console.log("after");
            console.log(req.cookies);
            */
           /*
            Setting req.cookies to null will not clear the cookies. It will only clear the reference to the cookies stored in the req object.
            To actually clear the cookies, you need to use the response object and set the Set-Cookie header to expire the cookies.
            ***
            Using the response object to clear cookies is the recommended approach because it directly modifies the HTTP response headers sent to the client, instructing the browser to remove the cookies.
            This method ensures that the cookies are correctly invalidated on the client side.
            */
            //console.log("value = "+user);
            if (user.hashedRt===null) {
                //console.log('Email already exists');
                // User already logged out, throw a custom exception
                throw new HttpException('User already logged out!', HttpStatus.BAD_REQUEST);
            }
            const result = await this.usersRepository.update(
                { id: userId, hashedRt: Not(IsNull()) },
                { hashedRt: null }
            );    
            //Result object: UpdateResult { generatedMaps: [], raw: [], affected: 1 }
         // Check if any rows were affected by the update operation
        if (result.affected && result.affected > 0) {
            //Success
            res.status(200).json({
                message: 'User Logout Successfull!'
            });
        } else {
         //Failure
         res.status(200).json({
            message: 'No rows were affected by the update'
        });
        }
        console.log(result);
   
           
       
        } catch (error) {
            //console.error(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async refreshTokens(userId: number, rt: string){
        try{
            const user = await this.usersRepository.findOneBy({ id: userId });   
            if(!user || !user.hashedRt) throw new ForbiddenException("Access denied");
            const rtMatches = await bcrypt.compare(rt, user.hashedRt);

            const tokens = await this.getTokens(user.id, user.email, user.role_id.name);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return tokens;
            }catch(error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async resetPassword(userEmail: string){
        try{
            //console.log('here');
            //Condition 1
            //Check if user exists
            const user = await this.usersRepository.findOneBy({ email: userEmail });
            //console.log(user.passwordResetToken !==null);   
            //console.log(user.resetPasswordExpirationToken !==null); 
            //If not exists
            if(!user) throw new HttpException("No user is registered under the email '"+userEmail+"'", HttpStatus.NOT_FOUND);
            
            //Condition 2
            //check if user already generated reset pasword token if so use that do not generate anything else field is null after every reset you must set it to null
            // *also check if it is expired or not et the time as variable from config
           
            if(user.passwordResetToken !==null && user.resetPasswordExpirationToken.getTime !==null){
                const currentTimeInMs = Date.now();
                const tokenExpirationTimeInMs =  user.resetPasswordExpirationToken.getTime();
                const timeLeft  = tokenExpirationTimeInMs - currentTimeInMs;
                const remainingTimeSeconds = timeLeft / 1000;
                /*
                console.log("Current time: "+currentTimeInMs);
                console.log("Expiration time: "+tokenExpirationTimeInMs);
                console.log("Timeleft MS : "+timeLeft);
                console.log("Timeleft S : "+timeLeft/1000);
                */
                const errorMessage = {
                    message: `A reset password email has already been sent to '${userEmail}'!`,
                    remainingTime: remainingTimeSeconds // Include remaining time in the response
                  };
                if (timeLeft > 0) {
                    // There is time left before expiration
                    //console.log(`Time left: ${timeLeft /1000/60} minutes`);
                    throw new HttpException(errorMessage, HttpStatus.TOO_MANY_REQUESTS);
                }    
                   
            }
            //console.log("Outside of if");
            // The token has either expired or user rest his token for the first time
            //if (currentTimeInMs > tokenExpirationTimeInMs)
            //console.log("Token has expired")
            //else user exists and does not have an existing pwd token
            user.passwordResetToken = null;
            user.resetPasswordExpirationToken = null;
            await this.usersRepository.save(user);
            
            //Condition 3        
            //exit loop only if the generated token is 100% unique
            while(true){
                //generating unique random bytes - read comments on said function for more details
                var generatedResetPasswordToken = await this.generateCustomToken();
                var resetPasswordTokenExists = await this.usersRepository.findOneBy({ passwordResetToken: generatedResetPasswordToken });
                
                //Checking is unique value exists:
                if(!resetPasswordTokenExists){
                    //console.log("unique");
                    break;
                }
            }
            //Updating user
            user.passwordResetToken = generatedResetPasswordToken;
            user.resetPasswordExpirationToken = new Date(Date.now() + (300 * 1000));
            await this.usersRepository.save(user);
            this.logger.log('Sending Reset Password Email Payload...');
            

              
            const response:ResetPasswordResponse = await lastValueFrom(this.emailService.send({ cmd: 'send_reset_password_email' }, user)); 
            const currentTimeInMs = Date.now();
            const tokenExpirationTimeInMs =  user.resetPasswordExpirationToken.getTime(); 
            const timeLeft  = tokenExpirationTimeInMs - currentTimeInMs; 
            const remainingTimeSeconds = timeLeft / 1000;
            response.remainingTime = remainingTimeSeconds;
            this.logger.log(response.message);
            return response;

        }catch(error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.log(error);
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    /*
     The randomBytes function is designed to provide cryptographically secure random values,
     which means that it should be highly unpredictable and difficult to reproduce.
     The likelihood of generating the same token is extremely low, but it's not completely impossible.
    */
    async generateCustomToken(): Promise<string> {
        return new Promise((resolve, reject) => {
          randomBytes(32, (err, buffer) => {
            //console.log("before converting: ", buffer)
            // Output : <Buffer 09 c6 b8 38 33 c2 c1 65 3d 6f 58 08 b6 9e 09 68 ec b8 bf 1d 60 c2 6e 25 be d3 a0 5d 3b 08 b8 00>
            if (err) {
              reject("Error generating token");
            }
            resolve(buffer.toString('hex'));
            //console.log("After converting: ", buffer.toString('hex) value)
            // Output: 09c6b83833c2c1653d6f5808b69e0968ecb8bf1d60c26e25bed3a05d3b08b800
          });
        });
    }
    async newPassword(userNewPassword: string, passwordResetToken: string){
        try {
        if (!userNewPassword || !passwordResetToken) {
            throw new HttpException('Please provide a password!', HttpStatus.BAD_REQUEST);
        }
        
        // Find user by reset password token and check if token is still valid
        const user = await this.usersRepository.findOneBy({ 
            passwordResetToken: passwordResetToken
        });
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.CONFLICT);
        }
        //Checking token experation time aka => validty
        if(user.passwordResetToken !==null && user.resetPasswordExpirationToken.getTime !==null){
            const currentTimeInMs = Date.now();
            const tokenExpirationTimeInMs =  user.resetPasswordExpirationToken.getTime();
            const timeLeft  = tokenExpirationTimeInMs - currentTimeInMs;
          
            if (timeLeft < 0) {
                throw new HttpException("Your reset password token for the email '"+user.email+"', has expired, you must reset it again!", HttpStatus.UNAUTHORIZED);
            }      
        }

        //Hashing password
        const hashedPassword = await this.hashData(userNewPassword);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.resetPasswordExpirationToken = null;

        const savedUser = await this.usersRepository.save(user);
        if(savedUser){
            return { 
                message: 'Password updated, you can now login using your new password!'
             };
        }else{
            return { 
                message: 'Error while updating user password'
             };
        }
        
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.log(error);
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }
      }
    
}
