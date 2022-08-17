import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UsersModule } from "./users/users.module";
import { AppController } from "./app.controller";
import { AlbumEntity } from "./entities/album.entity";
import { TrackEntity } from "./entities/track.entity";
import { ArtistEntity } from "./entities/artist.entity";
import { MusicModule } from "./music/music.module";
import { CartController } from "./cart/cart.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production")
          .default("development"),
        PORT: Joi.number().default(3000),
        PG_HOST: Joi.string().default("localhost"),
        PG_PORT: Joi.number().default(5432),
        PG_USERNAME: Joi.string(),
        PG_PASSWORD: Joi.string(),
        PG_DATABASE: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("PG_HOST"),
        port: config.get("PG_PORT"),
        username: config.get("PG_USERNAME"),
        password: config.get("PG_PASSWORD"),
        database: config.get("PG_DATABASE"),
        entities: [UserEntity, ArtistEntity, AlbumEntity, TrackEntity],
        synchronize: true, // leave this as true because it is a mock application
        extra: {
          // pool size
          // FIXME yes, it's ok to set it to 1 to see the difference between not pooling and pooling
          max: 1,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      ArtistEntity,
      AlbumEntity,
      TrackEntity,
      UserEntity,
    ]),
    UsersModule,
    MusicModule,
  ],
  controllers: [AppController, CartController],
  providers: [AppService],
})
export class AppModule {}
