import {
    BadRequestException,
    Injectable,
} from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

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

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            message: "User created successfully",
            accessToken: token,

            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(
            loginDto.email,
        );

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            accessToken: token,

            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}