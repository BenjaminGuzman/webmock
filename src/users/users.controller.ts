import { Body, Controller, Post, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDTO } from "./users.dto";
import { Response } from "express";
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
    // sudo docker exec -ti ce5aa1753921 bash
    // sudo docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=pass -v ~/projects/webmock/db/db-init.sh:/docker-entrypoint-initdb.d/db.init.sh -d postgres
    const user = new UserEntity();
    user.dob = body.dob;
    user.username = body.username;
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    // FIXME: this is intentionally using the synchronized version, just to prove it's bad and impacts performance
    user.password = bcrypt.hashSync(body.password, UsersController.ROUNDS);

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      console.error("Error while registering a user ", e);
      return res.render("500", {
        title: "USer registration error",
        message: e.message,
      });
    }

    return res.render("");
  }

  @Post("/login")
  login() {}
}
