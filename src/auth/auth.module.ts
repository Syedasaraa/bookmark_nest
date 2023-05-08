import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';

@Module({
  imports: [JwtModule.register({}) , NestjsFormDataModule.config({ storage: MemoryStoredFile })], 
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy ],
})
export class AuthModule {}
