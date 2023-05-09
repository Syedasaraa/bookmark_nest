import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    
    async getAllUsers() {
        const users = await this.prisma.user.findMany();
        if (! users) {
            return { message: 'database empty' }
        }
        return users;
    }
    
    async profile(id : number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            }
        })
        return user
    }

    async deleteUser(id: number) {
         await this.prisma.user.delete({
           where: {
             id,
           },
         });
         return { message: 'User successfully deleted' };
    }

    async deleteAll() {

        await this.prisma.user.deleteMany()
        return { message : "Database deleted "}
    }
}
