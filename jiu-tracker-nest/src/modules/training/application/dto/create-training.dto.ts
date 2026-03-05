import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsNotEmpty()
  is_open_mat: boolean;

  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value ?? true;
  })
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

  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  @IsInt()
  @Min(0)
  duration: number; // in minutes

  @IsString()
  @IsOptional()
  notes?: string;
}
