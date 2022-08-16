import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth-guard.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { AlbumEntity } from "../../entities/album.entity";

@Controller("album")
@UseGuards(AuthGuard)
export class AlbumController {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,
  ) {}

  @Get(":albumId")
  async album(@Param() params, @Req() req: Request, @Res() res: Response) {
    const albumId: string = params.albumId;
    try {
      const album = await this.albumsRepository.findOne({
        where: {
          id: albumId as unknown as number,
        },
        relations: ["artist", "tracks"],
      });
      if (!album)
        return res.render("error", {
          statusCode: 400,
          message: "Album information was not found in database",
          details: `Album with id ${albumId} doesn't exist`,
        });

      // transform the tracks inside the cart from an array to a hashmap to improve performance
      const cartMap = { tracks: {} };
      if (req.session.cart && req.session.cart.tracks)
        for (const trackId of req.session.cart.tracks)
          cartMap.tracks[trackId] = true;

      return res.render("album", {
        album,
        username: req.session.username,
        cartMap,
        cart: req.session.cart,
      });
    } catch (e) {
      console.error(
        `Error while fetching album info for album id ${albumId}`,
        e,
      );
      return res.render("error", {
        statusCode: 500,
        message: `Couldn't fetch album info for album with id "${albumId}"`,
      });
    }
  }
}
