import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

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
      if (dto.rememberMeToken) {
        const rememberMeToken = this.jwtService.sign({
          email: user.email,
          sub: user.id,
        });
         await this.prisma.user?.update({
          where: {
            id: user.id
          },
           data: { 
            rememberMeToken
          },
        });
      }
      //return the saved user
      return this.signToken(user.id, user.email);
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
      return this.signToken(user.id, user.email);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('SECRET'),
    });

    return { access_token: token };
  }

}


