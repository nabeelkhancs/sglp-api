import { IsString, IsNotEmpty, IsNumber, IsEmpty } from 'class-validator';

export default class ModuleDTO {
  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNotEmpty()
  @IsString()
  icon!: string;

  @IsString()
  url!: string;

  @IsNotEmpty()
  // @IsNumber()
  order!: number | string;
}
