import { BadRequestException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Artist } from "./artist.model";
import { ArtistEntity } from "./artist.entity";
import { ArtistService } from "./artist.service";

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService
  ) {
  }

  @Query(() => [Artist])
  async search(
    @Args("search", {type: () => String, nullable: true}) search
    // TODO add pagination...
  ): Promise<Artist[]> {
    if (!search || search.length === 0)
      return (await this.artistService.getAll()).map(ArtistResolver.typeormArtist2GQL);

    if (!/^[a-zA-Z 0-9áéíóúÁÉÍÓÚñÑÄËÏÖÜäëïöü]+$/.test(search))
      throw new BadRequestException("Only letters are allowed");

    return (await this.artistService.search(search)).map(ArtistResolver.typeormArtist2GQL);
  }

  private static typeormArtist2GQL(artist: ArtistEntity): Artist {
    return {
      ...artist,
      albums: []
    };
  }
}
