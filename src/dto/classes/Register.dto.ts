import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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
  roleType!: string;

  @IsNotEmpty()
  @IsString()
  deptID!: string;

  // @IsNotEmpty()
  // @IsString()
  dptIdDoc!: any;
 
  @IsOptional()
  @IsString()
  firstPageVisited!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
