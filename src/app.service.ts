import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArtistEntity } from "./entities/artist.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async getAllArtists(): Promise<ArtistEntity[]> {
    return await this.artistRepository.find();
  }
}
