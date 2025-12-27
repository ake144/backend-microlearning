import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const { modules, ...courseData } = createCourseDto;

    return this.prisma.course.create({
      data: {
        ...courseData,
        modules: {
          create: modules.map((module) => ({
            title: module.title,
            lessons: {
              create: module.lessons.map((lesson) => ({
                title: lesson.title,
                duration: lesson.duration,
                overview: lesson.overview,
                transcript: lesson.transcript,
                videoId: lesson.videoId,
                resources: {
                  create: lesson.resources?.map((resource) => ({
                    title: resource.title,
                    url: resource.url,
                  })),
                },
                questions: {
                  create: lesson.questions?.map((question) => ({
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                questions: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                questions: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                questions: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    // Update is complex with nested relations, for now just update basic fields
    // or handle full update if needed.
    // Prisma doesn't support deep nested update easily without specific IDs.
    // For now, I'll just update course fields.
    const { modules, ...courseData } = updateCourseDto;
    return this.prisma.course.update({
      where: { id },
      data: courseData,
    });
  }

  async remove(id: number) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
