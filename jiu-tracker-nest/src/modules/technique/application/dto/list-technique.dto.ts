import { IsNotEmpty, IsString } from 'class-validator';

export class TechniqueListDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  name_portuguese: string;
}
