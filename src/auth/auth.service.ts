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
    console.log(dto)
    try {
      //generate the password hash
      const password = await argon.hash(dto.password);
      let rememberMeToken;
      //save the new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
          rememberChecked: dto.rememberMeChecked,
          role: dto.role,
        },
        select: {
          email: true,
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
          rememberChecked: true,
          rememberMeToken: true,
          role: true,
        },
      });
      if (dto.rememberMeChecked) {
        rememberMeToken = this.jwtService.sign({
          email: user.email,
          sub: user.id,
        });
        await this.prisma.user.update({
          where: {
            email: dto.email
          },
          data: {
            rememberMeToken: rememberMeToken,
          },
        });
      }
      if (dto.shop) {
        await this.prisma.user.update({
          where: {
           email : dto.email
          },
          data: {
            shop: {
              create: {
                postId:0,
                title: dto.shop,
               }
            }
          }
       })
      }

      //return the saved user
        let tokens;
        if (rememberMeToken) {
          tokens = {
            rememberMeToken: rememberMeToken,
            access: this.signToken(user.id, user.email),
          };
        } else {
          tokens = this.signToken(user.id, user.email);
        }
      return tokens;
      
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error.code)
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

      let rememberMeToken;
      if (dto.rememberMeChecked) {
        rememberMeToken = this.jwtService.sign({
          email: user?.email,
          sub: user?.id,
        });
        await this.prisma.user?.update({
          where: {
            email: dto.email,
          },
          data: {
            rememberMeToken: rememberMeToken,
          },
        });
      }
      if (!user) {
        throw new ForbiddenException ('User not found');
      }

      //match password
      //if doesnt match throw an error

      const isMatch = await argon.verify(user.password, dto.password);
      if (!isMatch) {
        throw new ForbiddenException('Incorrect Password');
      }

      //send back the user/JWT
      let tokens;
      if (rememberMeToken) {
        tokens = {
          rememberMeToken: rememberMeToken,
          access: this.signToken(user.id, user.email),
        };
      } else {
        tokens = this.signToken(user.id, user.email);
      }
      return tokens;
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
