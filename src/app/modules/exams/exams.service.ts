import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    const { examQuestions, ...examData } = createExamDto;
    return this.prisma.exam.create({
      data: {
        ...examData,
        examQuestions: {
          create: examQuestions,
        },
      },
      include: {
        examQuestions: true,
      },
    });
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        examQuestions: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: true,
      },
    });
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const { examQuestions, ...examData } = updateExamDto;
    
    // If examQuestions are provided, we might want to update them or replace them.
    // For simplicity, let's assume we are updating the exam details primarily.
    // Handling nested updates for questions can be complex (create, update, delete).
    // Here I'll just update the exam fields.
    
    return this.prisma.exam.update({
      where: { id },
      data: examData,
      include: {
        examQuestions: true,
      },
    });
  }

  async remove(id: number) {
    // Delete questions first if cascade is not set, but Prisma usually handles cascade if configured or we can delete manually.
    // Let's check schema. Relation is: exam Exam @relation(fields: [examId], references: [id])
    // No onDelete: Cascade specified in schema provided earlier.
    // So we should delete questions first.
    
    const deleteQuestions = this.prisma.examQuestion.deleteMany({
      where: {
        examId: id,
      },
    });

    const deleteExam = this.prisma.exam.delete({
      where: {
        id,
      },
    });

    return this.prisma.$transaction([deleteQuestions, deleteExam]);
  }
}
