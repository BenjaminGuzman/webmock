import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserLoginDTO, UserRegisterDTO } from "./users.dto";
import { Response, Request } from "express";
import * as bcrypt from "bcrypt";

@Controller("users")
export class UsersController {
  static readonly ROUNDS = 10;

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  @Post("/register")
  async register(@Body() body: UserRegisterDTO, @Res() res: Response) {
    if (body.password !== body.passwordConfirmation)
      throw new BadRequestException("Passwords do not match");

    // sudo docker exec -ti ce5aa1753921 bash
    // sudo docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=pass -v ~/projects/webmock/db/db-init.sh:/docker-entrypoint-initdb.d/db.init.sh -d postgres
    const user = new UserEntity();
    user.dob = body.dob;
    user.email = body.email;
    user.username = body.username;
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    // FIXME: this is intentionally using the synchronized version, just to prove it's bad and impacts performance
    user.password = bcrypt.hashSync(body.password, UsersController.ROUNDS);

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      console.error("Error while registering a user ", e);
      return res.render("error", {
        statusCode: 500,
        message: "User registration error",
        details: e.message,
      });
    }

    return res.render("index", {
      successfulRegistration: true,
    });
  }

  @Post("/login")
  async login(
    @Body() body: UserLoginDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user = await this.usersRepository.findOneBy({
        username: body.username,
      });

      if (!user)
        return res.render("index", {
          loginErrors: ["Invalid username"],
        });

      if (!bcrypt.compareSync(body.password, user.password))
        return res.render("index", {
          loginErrors: ["Invalid password"],
        });

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      req.session.email = user.email;
    } catch (e) {
      return res.render("error", {
        statusCode: 500,
        message: "Error while verifying credentials",
        details: e.message,
      });
    }

    return res.redirect("/v1");
  }

  @Get("/logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) console.error(err);
        return resolve();
      });
    });

    return res.redirect("/v1");
  }
}
