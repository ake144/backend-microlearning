import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
