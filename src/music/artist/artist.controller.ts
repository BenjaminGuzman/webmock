import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { ArtistEntity } from "../../entities/artist.entity";
import { Request, Response } from "express";

@Controller("artist")
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

      return res.render("artist", { artist, username: req.session.username });
    } catch (e) {
      return res.render("error", {
        statusCode: 500,
        message: `Couldn't fetch artist info for artist with id "${artistId}"`,
      });
    }
  }
}
