import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDto {

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(()=> Number)
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(()=> Number)
  page?: number;
}
