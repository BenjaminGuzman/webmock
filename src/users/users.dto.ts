import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserRegisterDTO {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(1_000)
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(1_000)
  passwordConfirmation: string;
}

export class UserLoginDTO {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(1_000)
  password: string;
}
