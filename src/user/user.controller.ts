import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor ( private user : UserService) {}
  @Get()
   getAllUsers() {
    return this.user.getAllUsers()
  }

  @Get(':id')
  profile(@Param('id') id: string) {
    const idd = Number(id)
    return this.user.profile(idd)
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    const idd = Number(id);
     return this.user.deleteUser(idd)
  }

  @Delete('')
  deleteAll() {
  return this.user.deleteAll()
  }
}
