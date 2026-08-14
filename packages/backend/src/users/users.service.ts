import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsersInTenant(tenantId: string) {
    const memberships = await this.prisma.userTenant.findMany({
      where: { tenantId },
      include: {
        user: true,
        role: true,
      },
    });
    return memberships.map((m) => ({
      userId: m.user.id,
      email: m.user.email,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      role: m.role.name,
      roleId: m.roleId,
      assignedAt: m.assignedAt,
    }));
  }

  async assignRole(tenantId: string, userId: string, roleId: string) {
    const membership = await this.prisma.userTenant.findFirst({
      where: { userId, tenantId },
    });
    if (!membership) {
      throw new NotFoundException('User not in this tenant');
    }
    await this.prisma.userTenant.update({
      where: { id: membership.id },
      data: { roleId },
    });
    return { success: true };
  }

  async removeUser(tenantId: string, userId: string) {
    const membership = await this.prisma.userTenant.findFirst({
      where: { userId, tenantId },
    });
    if (!membership) {
      throw new NotFoundException('User not in this tenant');
    }
    await this.prisma.userTenant.delete({ where: { id: membership.id } });
    return { success: true };
  }
}