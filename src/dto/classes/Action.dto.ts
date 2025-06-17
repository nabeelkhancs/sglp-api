import { IsString, IsNotEmpty } from 'class-validator';

export default class ActionDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
