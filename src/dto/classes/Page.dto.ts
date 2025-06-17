import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class PageDTO {
  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsString()
  icon!: string;

  @IsNotEmpty()
  @IsString()
  url!: string;

  @IsNotEmpty()
  order!: number | string;

  @IsNotEmpty()
  @IsNumber()
  moduleId!: number;
}
