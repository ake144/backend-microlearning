import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'The avatar URL of the user', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;
}
