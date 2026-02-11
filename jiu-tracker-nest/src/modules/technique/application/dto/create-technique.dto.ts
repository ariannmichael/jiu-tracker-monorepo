import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateTechniqueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  name_portuguese: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  description_portuguese: string;

  @IsInt()
  category: number;

  @IsInt()
  difficulty: number;
}
