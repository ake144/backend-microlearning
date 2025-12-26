import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { AppConfigModule } from 'src/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/core/shared.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    CoreModule,

    SharedModule,

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
export class AppModule {}
