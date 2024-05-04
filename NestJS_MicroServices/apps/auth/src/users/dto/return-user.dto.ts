import { Role } from "../../roles/entities/role.entity";

export class UserDto {
    id: number;
    username: string;
    email: string;
    passwordResetToken: string;
    resetPasswordExpirationToken: Date;
    disabled: boolean;
    role_id: Role; 
}