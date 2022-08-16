import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArtistEntity } from "../../entities/artist.entity";
import { Request, Response } from "express";
import { AuthGuard } from "../../auth-guard.service";

@Controller("artist")
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistsRepository: Repository<ArtistEntity>,
  ) {}

  @Get(":artistId")
  async artist(@Param() params, @Req() req: Request, @Res() res: Response) {
    const artistId: string = params.artistId;
    try {
      const artist = await this.artistsRepository.findOne({
        where: {
          id: artistId as unknown as number,
        },
        relations: ["albums"],
      });
      if (!artist)
        return res.render("error", {
          statusCode: 400,
          message: "Artist information was not found in database",
          details: `Artist with id ${artistId} doesn't exist`,
        });

      return res.render("artist", {
        artist,
        username: req.session.username,
        cart: req.session.cart,
      });
    } catch (e) {
      console.error(
        `Error while fetching artist info for artist id ${artistId}`,
        e,
      );
      return res.render("error", {
        statusCode: 500,
        message: `Couldn't fetch artist info for artist with id "${artistId}"`,
      });
    }
  }
}
