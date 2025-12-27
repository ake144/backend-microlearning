import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  provider: string;
}
