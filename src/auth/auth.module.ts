import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService()
@Module({
  imports: [
    JwtModule.register({
      secret:
        config.get('SECRET')
    }),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
