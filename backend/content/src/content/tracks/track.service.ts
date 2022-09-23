import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TrackEntity } from "./track.entity";
import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";
import { AlbumEntity } from "../albums/album.entity";

@Injectable()
export class TrackService implements OnModuleInit {
  private tracksRepo: Repository<TrackEntity>;

  constructor(
    /*@InjectRepository(TrackEntity)
    private tracksRepo: Repository<TrackEntity>*/
    private moduleRef: ModuleRef,
    @Inject(REQUEST) private request: Record<string, unknown>
  ) {
  }

  async onModuleInit() {
    const contextId = ContextIdFactory.getByRequest(this.request);
    this.tracksRepo = await this.moduleRef.resolve(getRepositoryToken(TrackEntity), contextId);
  }

  getByIds(ids: number[]): Promise<TrackEntity[]> {
    return this.tracksRepo.findBy({
      id: In(ids)
    });
  }

  getById(id: number): Promise<TrackEntity> {
    return this.tracksRepo.findOneBy({id: id});
  }

  search(search: string): Promise<TrackEntity[]> {
    // TODO implement this method
    throw new Error("Not implemented yet");
  }
}
