import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateBeltProgressDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsInt()
  @Min(0)
  stripes: number;
}
