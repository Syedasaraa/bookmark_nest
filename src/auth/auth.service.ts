import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService
    , private jwtService: JwtService) { }

  async signup(dto: AuthDto) {
    try {
      //generate the password hash
      const password = await argon.hash(dto.password);
      //save the new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
        },
        select: {
          email: true,
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      //return the saved user
      const payload = { email: user.email, sub: user.id };
      return {
        user: user,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      } else {
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    try {
      //find user by email
      //if does not exist throw an error
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        return { status: 'failed', message: 'User Not found' };
      }

      //match password
      //if doesnt match throw an error

      const isMatch = await argon.verify(user.password, dto.password);
      if (!isMatch) {
        return { status: 'failed', message: 'Incorrect password' };
      }

      //send back the user/JWT
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
