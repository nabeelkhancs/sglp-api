import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class PermissionDTO {
  @IsNotEmpty()
  @IsNumber()
  pageId!: number;

  @IsNotEmpty()
  @IsNumber()
  actionId!: number;
}

class Data {
  permissions!: PermissionDTO[]
}

export class RoleAddDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;

  permissions!: PermissionDTO[]
}

export class RoleUpdateDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  data?: Data
}

