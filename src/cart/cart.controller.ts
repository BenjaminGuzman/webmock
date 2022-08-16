import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth-guard.service";
import { Add2CartDTO } from "./cart.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TrackEntity } from "../entities/track.entity";
import { Request, Response } from "express";

@Controller("cart")
@UseGuards(AuthGuard)
export class CartController {
  constructor(
    @InjectRepository(TrackEntity)
    private tracksRepository: Repository<TrackEntity>,
  ) {}

  @Get()
  async cart(@Req() req: Request, @Res() res: Response) {
    const cart = {};
    let total = 0;

    try {
      if (req.session.cart && req.session.cart.tracks) {
        const tracks = await this.tracksRepository.find({
          where: {
            id: In(req.session.cart.tracks),
          },
          relations: {
            album: {
              artist: true,
            },
          },
        });

        // FIXME watch for floating point arithmetic flaws. Use an specialized library for currencies
        total = tracks
          .map((t) => parseFloat(t.price as unknown as string))
          .reduce((accumulator, current) => accumulator + current);

        // group by artist, then by album
        for (const track of tracks) {
          if (!(track.album.artist.name in cart))
            cart[track.album.artist.name] = {};

          if (!(track.album.title in cart[track.album.artist.name]))
            cart[track.album.artist.name][track.album.title] = [];

          cart[track.album.artist.name][track.album.title].push(track);
        }
      }

      return res.render("cart", {
        cart,
        username: req.session.username,
        total,
      });
    } catch (e) {
      return res.render("error", {
        statusCode: 500,
        message: "",
        details: "",
      });
    }
  }

  @Post("add")
  async add(@Body() body: Add2CartDTO, @Req() req: Request) {
    let tracks: TrackEntity[];
    try {
      tracks = await this.tracksRepository.find({
        where: {
          id: In(body.tracks),
        },
      });
    } catch (e) {
      console.error("Error while retrieving tracks", e);
      return new InternalServerErrorException("Couldn't add tracks to cart");
    }
    if (tracks.includes(null) || tracks.includes(undefined))
      throw new BadRequestException(
        "One or more of the given track ids is invalid",
      );

    // FIXME, it's a bad idea to store the shopping cart within the session
    //  but it's done anyways because it's a mock app
    if (!req.session.cart) req.session.cart = { tracks: [] };
    if (!req.session.cart.tracks) req.session.cart.tracks = [];

    req.session.cart.tracks = req.session.cart.tracks.concat(
      tracks.map((track) => track.id),
    );
  }
}
