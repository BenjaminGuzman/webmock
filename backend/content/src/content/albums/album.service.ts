import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { ArtistEntity } from "../artists/artist.entity";
import { In, Repository } from "typeorm";
import { AlbumEntity } from "./album.entity";
import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepo: Repository<AlbumEntity>
  ) {
  }

  getByIds(ids: number[]): Promise<AlbumEntity[]> {
    return this.albumsRepo.findBy({
      id: In(ids)
    });
  }

  getById(id: number): Promise<AlbumEntity> {
    return this.albumsRepo.findOneBy({id: id});
  }

  getByArtistId(artistId: number): Promise<AlbumEntity[]> {
    return this.albumsRepo.findBy({artist: {id: artistId}});
  }

  search(search: string): Promise<AlbumEntity[]> {
    // TODO implement this method
    throw new Error("Not implemented yet");
  }
}
