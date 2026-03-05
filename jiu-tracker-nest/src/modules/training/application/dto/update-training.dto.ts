import {
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateTrainingDto {
  @IsBoolean()
  @IsNotEmpty()
  is_open_mat: boolean;

  @IsBoolean()
  @IsOptional()
  is_gi?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  submit_using_options_ids: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tapped_by_options_ids: string[];

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsInt()
  @IsNotEmpty()
  duration: number; // in minutes

  @IsString()
  @IsOptional()
  notes?: string;
}
