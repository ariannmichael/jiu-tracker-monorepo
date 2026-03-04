import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  belt_color: string;

  @Transform(({ value }: { value: unknown }): number => {
    if (typeof value === 'string') return parseInt(value, 10);
    if (typeof value === 'number') return Math.floor(value);
    return Number.NaN;
  })
  @IsInt()
  @Min(0)
  belt_stripe: number;
}
