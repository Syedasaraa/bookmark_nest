import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(config: ConfigService , private prisma : PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      expiresIn : '15m',
      secretOrKey: config.get('SECRET'),
    });
  }

  async validate(payload: { sub : number , email : string} ) {
    const user = await this.prisma.user.findFirst({
      where: {
        email : payload.email
      }
    })
    if (!user) {
      throw new NotFoundException()
    }

    return user;
  }
}
