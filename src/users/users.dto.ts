export class UserRegisterDTO {
  firstName: string;
  lastName: string;
  username: string;
  dob: Date;
  password: string;
}

export class UserLoginDTO {
  username: string;
  password: string;
}
