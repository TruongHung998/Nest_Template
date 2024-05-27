import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UserModule} from "./user/user.module";
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("MONGO_DB"),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
