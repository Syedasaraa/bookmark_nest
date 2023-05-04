import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './auth/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    BookmarkModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register ({
      global: true,
      secret: jwtConstants.secret,
      signOptions : { expiresIn : '60s'}
    })
  ],
})
export class AppModule {}
