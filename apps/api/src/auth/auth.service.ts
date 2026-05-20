import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(
      signupDto.email,
    );

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      10,
    );

    const user = await this.usersService.create({
      name: signupDto.name,
      email: signupDto.email,
      password: hashedPassword,
    });

    return {
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}