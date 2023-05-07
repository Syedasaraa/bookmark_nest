import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Get()
  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  @Get(':id')
  profile(@GetUser('') user: string) {
    return { user };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const idd = Number(id);
    await prisma.user.delete({
      where: {
        id: idd,
      },
    });
    return { message: 'Successful . User deleted' };
  }
}
