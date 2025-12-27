import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        userId,
        ...createNoteDto,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.note.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    return this.prisma.note.updateMany({
      where: { id, userId },
      data: updateNoteDto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.note.deleteMany({
      where: { id, userId },
    });
  }
}
