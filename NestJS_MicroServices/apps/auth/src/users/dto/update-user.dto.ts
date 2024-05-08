import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../roles/entities/role.entity';


export class UpdateUserDto extends PartialType(CreateUserDto) {

    @MinLength(5, { message: 'Username should be at least 5 characters long'})
    @MaxLength(40, { message: 'Username should not exceed 40 characters'})
    @IsOptional({ message: 'Username must be provided'})
    username: string;

    @IsOptional()
    disabled: boolean;

    //create a separte dto for registration to allow password
    /*
    @MinLength(10, { message: 'Password should be at least 10 characters long'})
    @MaxLength(40, { message: 'Password should not exceed 40 characters'})
    @IsNotEmpty({ message: 'Password must be provided'})
    password: string;
    */
    //@IsNumber()
    //@IsNotEmpty({ message: 'Role must be provided'})
    @IsOptional()
    @IsNumber()
    role_id?: Role;
}
