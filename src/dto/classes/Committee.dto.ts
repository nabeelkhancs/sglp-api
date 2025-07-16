import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsBoolean, IsDate } from 'class-validator';

export default class CommitteeDTO {

  @IsOptional()
  @IsString()
  cpNumber?: string;

  @IsNotEmpty()
  @IsString()
  court!: string;

  @IsNotEmpty()
  @IsString()
  compositionHeadedBy!: string;

  @IsNotEmpty()
  @IsString()
  tors!: string;

  @IsNotEmpty()
  @IsString()
  report!: string;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  uploadedFiles?: string[];

  @IsOptional()
  @IsString()
  committeeApprovalFile?: string;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsNumber()
  deletedBy?: number;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

} 