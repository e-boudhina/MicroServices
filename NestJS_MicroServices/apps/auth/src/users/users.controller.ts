import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, InternalServerErrorException, HttpException, Res, Req, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '..//common/decorators/public.decorator';
import { Response } from 'express';
import { get } from 'http';
import { Request } from "express";
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from './validators/CustomUploadFileTypeValidator';
import { MAX_PROFILE_PICTURE_SIZE_IN_BYTES, VALID_UPLOADS_MIME_TYPES } from '../common/constants/variables';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/createUser')
  async createUser(@Res() response: Response, @Body() userDTO:CreateUserDto){
    
      try{

    
      const result = await this.usersService.createUser(userDTO);
      return response.status(result.statusCode).send({
          statusCode : result.statusCode,
          message: result.message
      });
    }catch(error){
      //add log file
      if (error instanceof HttpException) {
        return response.status(error.getStatus()).send({
          statusCode: error.getStatus(),
          message: error.message,
        });
      } else {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error!',
        });
      }
    }
  }
  

/*
  @Public()
  @Post()
    async create(@Res() response, @Body() createUserDto: CreateUserDto) {
      
      try{
        const exec_Result = await this.usersService.create(createUserDto);
       
          response.status(HttpStatus.CREATED).send({
          message: 'User created successfully',
          user: exec_Result
        }); 
      
      }catch(error){
        
        //Repetitive both in service and here?
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          //message: 'User Creation Failed!',
          error: error.message,
        }); 
      }
    }
*/
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
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

  @Public()
  @Post('authenticatedUser')
  getAuthenticatedUser(@Req() request: Request) {
    // Access cookies from the request object
    const accessToken = request.cookies['access_token']; 

    // Decode the JWT to get user information
    try {
      const decodedToken = jwt.verify(accessToken, 'at-secret'); // Replace 'your-secret-key' with your actual secret key
      console.log("decoded token");
      console.log(decodedToken);
      const userId = decodedToken.sub; // Assuming 'sub' contains the user ID in the JWT payload

      // Now you can use the user ID to retrieve the user
      const user = this.usersService.getAuthenticatedUser(+userId);

      return user;
    } catch (error) {
      // Handle JWT verification errors
      console.error('JWT verification error:', error);
      return { 
        message: 'Invalid token. Please log in again.' 
       
      };
    }
  }
  @Public()
  @Post('disable-account/:id')
  disableUserAccount(@Param('id') id: number) {
    try {
      console.log('hey');
      return this.usersService.disableUserAccount(id);
    }catch (error) {

    }
  }
  
  @Public()
  @Post('enable-account/:id')
  enableUserAccount(@Param('id') id: number) {
    try {
      console.log('hey');
      return this.usersService.enableUserAccount(id);
    }catch (error) {

    }
  }

@Public()
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(
  @UploadedFile(
    new ParseFilePipeBuilder()
      //.addFileTypeValidator({
     //   fileType: 'image/jpeg',
      //})
      .addValidator(
        new CustomUploadFileTypeValidator({
          fileType: VALID_UPLOADS_MIME_TYPES,
        }),
      )
      .addMaxSizeValidator({
        maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File
) {
  try {
    const result = await this.usersService.storeImage(file);
    return result;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

}
}
