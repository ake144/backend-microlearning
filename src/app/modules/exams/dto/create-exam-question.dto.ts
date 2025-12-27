import { IsString, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty()
  @IsInt()
  @Min(0)
  correctAnswer: number;
}
