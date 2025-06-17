import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDate, IsArray, IsNumber, IsDateString } from 'class-validator';

export default class CaseDTO {

  @IsOptional()
  @IsString()
  caseNumber?: string;

  @IsNotEmpty()
  @IsString()
  caseTitle!: string;

  @IsNotEmpty()
  @IsString()
  court!: string;

  @IsNotEmpty()
  @IsString()
  region!: string;

  @IsNotEmpty()
  @IsString()
  relativeDepartment!: string;

  @IsNotEmpty()
  @IsDateString()
  dateReceived!: Date;

  @IsOptional()
  @IsDateString()
  dateOfHearing!: Date | null;

  @IsNotEmpty()
  @IsString()
  caseStatus!: string;

  @IsNotEmpty()
  @IsString()
  caseRemarks!: string;

  @IsOptional()
  @IsBoolean()
  isUrgent!: boolean;

  @IsOptional()
  @IsBoolean()
  isCallToAttention!: boolean;

  @IsOptional()
  @IsNumber()
  createdBy!: number | null;

  @IsOptional()
  @IsNumber()
  updatedBy!: number | null;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsNumber()
  deletedBy?: number | null;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  uploadedFiles?: string[];
}
