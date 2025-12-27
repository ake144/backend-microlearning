import { IsString, IsInt, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateExamQuestionDto } from './create-exam-question.dto';

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  level: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  questions: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  duration: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  passingScore: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  attempts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  averageScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({ type: [CreateExamQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionDto)
  examQuestions?: CreateExamQuestionDto[];
}
