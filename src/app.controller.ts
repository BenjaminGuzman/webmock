import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Render,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as superagent from "superagent";
import { AppService } from "./app.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArtistEntity } from "./entities/artist.entity";
import { TrackEntity } from "./entities/track.entity";
import { AlbumEntity } from "./entities/album.entity";
import { UserEntity } from "./entities/user.entity";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(ArtistEntity)
    private artistsRepository: Repository<ArtistEntity>,
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,
    @InjectRepository(TrackEntity)
    private tracksRepository: Repository<TrackEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {
    // instantiate the database
    // docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=pass -v ~/projects/webmock/db/employees-init.sh:/docker-entrypoint-initdb.d/employees.init.sh -v ~/projects/webmock/db/employees_data.sql:/employees.sql -d postgres
    // docker exec -ti postgres bash
  }

  @Get()
  async root(@Req() req: Request, @Res() res: Response) {
    if (!req.session.userId) return res.render("index");

    let artists: ArtistEntity[];
    try {
      artists = await this.artistsRepository.find();
    } catch (e) {
      console.error("Error while retrieving artists", e);
      return res.render("error", {
        statusCode: 500,
        message: "Error while loading home page",
        details: "Couldn't fetch artists",
      });
    }

    return res.render("home", {
      ...req.session,
      artists,
      cart: req.session.cart,
    });
  }

  @Get("/500")
  @Render("error")
  error500() {
    return {
      statusCode: 500,
      message: "Just testing the error page looks good",
      details: "Details about the error go here..........",
    };
  }

  /**
   * Delete all the music currently saved
   */
  @Delete("/music")
  async deleteMusic() {
    try {
      await this.tracksRepository
        .clear()
        .then(() => this.albumsRepository.clear())
        .then(() => this.artistsRepository.clear());
      return { success: true };
    } catch (e) {
      console.error("Error while deleting all music", e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Delete all the users currently registered
   */
  @Delete("/users")
  async deleteUsers() {
    try {
      await this.usersRepository.clear();
      return { success: true };
    } catch (e) {
      console.error("Error while deleting all users", e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Populate the database with some records
   */
  @Post("/populate")
  async populate() {
    const artists = [
      "eminem",
      "dua lipa",
      "residente",
      "vico c",
      "birdy",
      "ana tijoux",
      "Zoe",
      "The chainsmokers",
      "Natalia Lafourcade",
      "Kygo",
      "Florence + The Machine",
      "M83",
      "oh wonder",
      "Carla Morrison",
      "Cancerbero",
      "onerepublic",
      "imagine dragons",
      "Calvin Harris",
      "Cartel de santa",
      "Boyz noise",
      "Son Lux",
      "Lost Years",
      "Mac Quayle",
      "HiTNRuN",
      "Kavinsky",
    ];

    try {
      const nRegisteredArtists = await this.artistsRepository.count();
      if (nRegisteredArtists > 0)
        return {
          success: false,
          message: "DB_DIRTY",
          details: "Database may have already been initialized",
        };
    } catch (e) {
      console.error(e);
    }

    // save artists
    const promises = artists
      .map((artist) =>
        superagent
          .get(`https://api.deezer.com/search/artist?q=${artist}`)
          .accept("application/json"),
      )
      .map((p) => p.then((res) => res.body).catch(console.error))
      .map((p) => p.then((body) => body.data[0]))
      .map((p) =>
        p.then((deezerArtist: DeezerArtist) => {
          const artist = new ArtistEntity();
          artist.name = deezerArtist.name;
          artist.picture = deezerArtist.picture_medium;
          artist.nFans = deezerArtist.nb_fan;
          artist.nAlbums = deezerArtist.nb_album;
          artist.id = deezerArtist.id;
          artist.link = deezerArtist.link;

          this.artistsRepository
            .save(artist)
            // .then((artist) =>
            //   console.log(`Saved artist ${artist.name} (id ${artist.id})`),
            // )
            .catch(console.error);

          return artist;
        }),
      );

    // save albums
    const savedAlbums: AlbumEntity[] = [];
    const savedArtists = await Promise.all(promises);
    for (const artist of savedArtists) {
      const res = await superagent
        .get(`https://api.deezer.com/artist/${artist.id}/albums`)
        .accept("application/json");

      for (let deezerAlbum of res.body.data) {
        deezerAlbum = deezerAlbum as DeezerAlbum;
        const album = new AlbumEntity();
        album.title = deezerAlbum.title;
        album.cover = deezerAlbum.cover_medium;
        album.link = deezerAlbum.link;
        album.id = deezerAlbum.id;
        album.artist = artist;

        await this.albumsRepository
          .save(album)
          .then((album) => {
            // console.log(`Saved album ${album.title} (${album.artist.name})`);
            savedAlbums.push(album);
          })
          .catch(console.error);
      }
    }

    // save tracks
    for (const album of savedAlbums) {
      const res = await superagent
        .get(`https://api.deezer.com/album/${album.id}/tracks`)
        .accept("application/json");

      for (let deezerTrack of res.body.data) {
        deezerTrack = deezerTrack as DeezerTrack;
        const track = new TrackEntity();
        track.title = deezerTrack.title;
        track.link = deezerTrack.link;
        track.id = deezerTrack.id;
        track.album = album;
        track.preview = deezerTrack.preview;
        track.price = `${Math.floor(Math.random() * 10 + 1)}`;

        await this.tracksRepository
          .save(track)
          // .then((track) => {
          //   console.log(`Saved track ${track.title} (${track.album.title})`);
          // })
          .catch(console.error);
      }
    }

    return {
      success: true,
      message: "SUCCESS",
      details: "Database successfully initialized",
    };
  }
}

interface DeezerArtist {
  id: number;
  name: string;
  link: string;
  picture_medium: string;
  nb_album: number;
  nb_fan: number;
}

interface DeezerAlbum {
  id: number;
  title: string;
  link: string;
  cover_medium: string;
}

interface DeezerTrack {
  id: number;
  title: string;
  link: string;
  preview: string;
}
