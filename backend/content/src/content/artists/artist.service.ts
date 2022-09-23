import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ArtistEntity } from "./artist.entity";
import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";
import { TrackEntity } from "../tracks/track.entity";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistsRepo: Repository<ArtistEntity>
  ) {
  }

  getByIds(ids: number[]): Promise<ArtistEntity[]> {
    return this.artistsRepo.findBy({
      id: In(ids)
    });
  }

  getById(id: number): Promise<ArtistEntity> {
    return this.artistsRepo.findOneBy({id: id});
  }

  /**
   * Get all available artists
   * TODO implement pagination...
   */
  getAll(): Promise<ArtistEntity[]> {
    return this.artistsRepo.find();
  }

  search(search: string): Promise<ArtistEntity[]> {
    // TODO implement this method
    throw new Error("Not implemented yet");
  }
}
