import {
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTrainingDto {
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
