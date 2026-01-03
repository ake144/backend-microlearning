import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { CoreModule } from './core.module';
import { AppConfigModule } from 'src/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/core/shared.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth-module/auth.module';
import { CourseModule } from './modules/course/course.module';
import { ProgressModule } from './modules/progress/progress.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotesModule } from './modules/notes/notes.module';
import { FlashcardModule } from './modules/flashcard/flashcard.module';
import { BooksModule } from './modules/books/books.module';
import { ExamsModule } from './modules/exams/exams.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    CoreModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CourseModule,
    ProgressModule,
    PaymentModule,
    NotesModule,
    FlashcardModule,
    BooksModule,
    ExamsModule,

    SharedModule,

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        ttl: configService.get('redis.ttl'),
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60,
        limit: 10,
      }],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
