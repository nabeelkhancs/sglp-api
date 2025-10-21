import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class ResetPasswordDTO {

  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
  confirmPassword!: string;
}