import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { ArtistEntity } from "../artists/artist.entity";
import { In, Repository } from "typeorm";
import { AlbumEntity } from "./album.entity";
import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";

@Injectable()
export class AlbumService implements OnModuleInit {
  private albumsRepo: Repository<AlbumEntity>;

  constructor(
    /*@InjectRepository(AlbumEntity)
    private albumsRepo: Repository<AlbumEntity>*/
    private moduleRef: ModuleRef,
    @Inject(REQUEST) private request: Record<string, unknown>
  ) {
  }

  async onModuleInit() {
    const contextId = ContextIdFactory.getByRequest(this.request);
    this.albumsRepo = await this.moduleRef.resolve(getRepositoryToken(AlbumEntity), contextId);
  }

  getByIds(ids: number[]): Promise<AlbumEntity[]> {
    return this.albumsRepo.findBy({
      id: In(ids)
    });
  }

  getById(id: number): Promise<AlbumEntity> {
    return this.albumsRepo.findOneBy({id: id});
  }

  search(search: string): Promise<AlbumEntity[]> {
    // TODO implement this method
    throw new Error("Not implemented yet");
  }
}
