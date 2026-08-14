import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('roles')
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getRoles() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        isSystem: true,
      },
    });
  }
}