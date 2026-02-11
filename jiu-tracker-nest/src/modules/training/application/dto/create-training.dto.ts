import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  techniques_ids: string[];

  @IsInt()
  @IsNotEmpty()
  duration: number; // in minutes

  @IsString()
  @IsOptional()
  notes?: string;
}
