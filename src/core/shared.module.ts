import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MorganMiddleware } from "./middleware/logger/morgan.middleware";
import { ConfigModule } from "@nestjs/config";
import { LoggerService } from "./middleware/logger/logger.middleware";

@Module({
    imports: [ConfigModule ],
    exports: [LoggerService],
    providers: [LoggerService],
})
export class SharedModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MorganMiddleware).forRoutes('*');
    }
}