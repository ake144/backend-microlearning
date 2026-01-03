import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('courses_all')
  @CacheTTL(300) // 5 minutes
  @ApiOperation({ summary: 'Get all courses' })
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':slug')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get a course by slug' })
  findOne(@Param('slug') slug: string) {
    return this.courseService.findOne(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
