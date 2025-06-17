import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export default class VerifyOtpDTO {

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;

}
