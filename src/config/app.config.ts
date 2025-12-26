import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./configuration";
import { validationSchema } from "./vaidation";

const configModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `../.env`,

    load:[configuration],
    validationSchema: validationSchema
});


@Module({
    imports: [configModule],
    exports: [ConfigModule],
})

export class AppConfigModule {}