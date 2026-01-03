import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const { modules, ...courseData } = createCourseDto;

    const course = await this.prisma.course.create({
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

    await this.cacheManager.del('courses_all');
    return course;
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
    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: courseData,
    });

    await this.cacheManager.del('courses_all');
    // Also invalidate specific course if we were caching by ID/Slug
    // await this.cacheManager.del(`courses_${id}`); 

    return updatedCourse;
  }

  async remove(id: number) {
    const deletedCourse = await this.prisma.course.delete({
      where: { id },
    });

    await this.cacheManager.del('courses_all');
    return deletedCourse;
  }
}
