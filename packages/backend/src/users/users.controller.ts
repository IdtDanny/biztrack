import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Tenant } from '../common/decorators/tenant.decorator';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('users:view')
  getUsers(@Tenant() tenantId: string) {
    return this.usersService.getUsersInTenant(tenantId);
  }

  @Post(':userId/role')
  @Roles('users:manage')
  assignRole(
    @Tenant() tenantId: string,
    @Param('userId') userId: string,
    @Body('roleId') roleId: string,
  ) {
    return this.usersService.assignRole(tenantId, userId, roleId);
  }

  @Delete(':userId')
  @Roles('users:manage')
  removeUser(@Tenant() tenantId: string, @Param('userId') userId: string) {
    return this.usersService.removeUser(tenantId, userId);
  }
}