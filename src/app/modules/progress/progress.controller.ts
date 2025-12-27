import { Controller, Post, Body, Param, UseGuards, Request, Get } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':lessonId')
  @ApiOperation({ summary: 'Update lesson progress' })
  updateProgress(@Request() req, @Param('lessonId') lessonId: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.updateProgress(req.user.userId, +lessonId, updateProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user progress' })
  getUserProgress(@Request() req) {
    return this.progressService.getUserProgress(req.user.userId);
  }
}
