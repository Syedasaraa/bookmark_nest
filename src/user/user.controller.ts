import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    console.log({
      user : req.user
    })
    return 'User info';
  }
}
