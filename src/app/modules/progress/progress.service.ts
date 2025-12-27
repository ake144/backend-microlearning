import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(userId: string, lessonId: number, updateProgressDto: UpdateProgressDto) {
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: updateProgressDto,
      create: {
        userId,
        lessonId,
        ...updateProgressDto,
      },
    });
  }

  async getUserProgress(userId: string) {
    return this.prisma.lessonProgress.findMany({
      where: { userId },
    });
  }
}
