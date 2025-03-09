import { IsInt, IsOptional, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FollowersAndFollowingDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Id must be an integer' })
  @IsPositive({ message: 'Id must be a positive number' })
  id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;
}
