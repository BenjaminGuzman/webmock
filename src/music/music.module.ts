import { Module } from "@nestjs/common";
import { ArtistController } from "./artist/artist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "../entities/artist.entity";
import { AlbumEntity } from "../entities/album.entity";
import { TrackEntity } from "../entities/track.entity";
import { AlbumController } from "./album/album.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, AlbumEntity, TrackEntity])],
  controllers: [ArtistController, AlbumController],
})
export class MusicModule {}
