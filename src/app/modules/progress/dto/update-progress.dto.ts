import { IsNumber, IsBoolean, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgressDto {
  @ApiProperty({ example: 50, description: 'Video progress percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  videoProgress: number;

  @ApiProperty({ example: true, description: 'Whether the lesson is completed' })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ example: 80, description: 'Quiz score if applicable' })
  @IsNumber()
  @IsOptional()
  quizScore?: number;
}
