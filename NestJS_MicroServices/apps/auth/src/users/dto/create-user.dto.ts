import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Unique } from "typeorm";


export class CreateUserDto {

    static customEmailRegex: RegExp = /.+\@.+\..+/;
   
    
    @MinLength(10, { message: 'Email should be at least 10 characters long'})
    @MaxLength(40, { message: 'Email should not exceed 40 characters'})
    @IsNotEmpty({ message: 'Email must be provided'})
    @Matches(CreateUserDto.customEmailRegex, { message: 'Invalid email format' })
    email: string;
   

}
