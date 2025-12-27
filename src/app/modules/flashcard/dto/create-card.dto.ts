import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  front: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  back: string;
}
