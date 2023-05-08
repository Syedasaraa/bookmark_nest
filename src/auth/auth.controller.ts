import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { MemoryStoredFile } from 'nestjs-form-data/dist/classes/storage';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @FormDataRequest({ storage: MemoryStoredFile })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @FormDataRequest({ storage: MemoryStoredFile })
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
