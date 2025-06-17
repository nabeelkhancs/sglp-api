import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export default class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  cnic!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  govtID!: string;

  @IsNotEmpty()
  @IsString()
  designation!: string;

  @IsNotEmpty()
  @IsString()
  deptID!: string;

  // @IsNotEmpty()
  @IsString()
  dptIdDoc!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
