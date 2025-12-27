import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty()
  @IsString()
  correctAnswer: string;
}

export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  transcript?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  videoId?: string;

  @ApiProperty({ type: [CreateResourceDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResourceDto)
  @IsOptional()
  resources?: CreateResourceDto[];

  @ApiProperty({ type: [CreateQuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsOptional()
  questions?: CreateQuestionDto[];
}

export class CreateModuleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [CreateLessonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons: CreateLessonDto[];
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiProperty({ default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  priceETB?: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ type: [CreateModuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  modules: CreateModuleDto[];
}
