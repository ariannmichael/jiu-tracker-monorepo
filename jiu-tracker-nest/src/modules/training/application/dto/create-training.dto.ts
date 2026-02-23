import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  @IsNotEmpty()
  is_open_mat: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  submit_using_options_ids: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tapped_by_options_ids: string[];

  @IsInt()
  @IsNotEmpty()
  duration: number; // in minutes

  @IsString()
  @IsOptional()
  notes?: string;
}
