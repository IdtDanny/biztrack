import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash: hashed,
      },
    });

    // Create a default tenant for the user
    const tenant = await this.prisma.tenant.create({
      data: {
        name: `${dto.firstName}'s Company`,
        email: dto.email,
      },
    });

    // Assign user to tenant with Owner role
    const ownerRole = await this.prisma.role.findUnique({
      where: { name: 'Owner' },
    });
    if (!ownerRole) {
      throw new Error('Owner role not found. Run seed.');
    }

    await this.prisma.userTenant.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        roleId: ownerRole.id,
        assignedBy: user.id,
      },
    });

    // Generate tokens and get tenant data
    const tokens = await this.generateTokens(user.id, user.email, tenant.id);
    const tenants = await this.getUserTenants(user.id);
    
    return {
      ...tokens,
      tenants,
      currentTenant: tenant.id,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash) throw new UnauthorizedException('Use Google login');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // Get user's default tenant (first tenant)
    const membership = await this.prisma.userTenant.findFirst({
      where: { userId: user.id },
    });
    if (!membership) throw new UnauthorizedException('No tenant assigned');

    // Generate tokens and get tenant data
    const tokens = await this.generateTokens(user.id, user.email, membership.tenantId);
    const tenants = await this.getUserTenants(user.id);
    
    return {
      ...tokens,
      tenants,
      currentTenant: membership.tenantId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.id },
    });
    
    let tenantId: string;
    
    if (!user) {
      // Check if email exists, then link googleId, else create new user
      const existing = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });
      
      if (existing) {
        user = await this.prisma.user.update({
          where: { id: existing.id },
          data: { googleId: googleUser.id, avatar: googleUser.picture },
        });
        // Get existing tenant
        const membership = await this.prisma.userTenant.findFirst({
          where: { userId: user.id },
        });
        if (membership) {
          tenantId = membership.tenantId;
        } else {
          // Create new tenant if none exists
          const tenant = await this.prisma.tenant.create({
            data: {
              name: `${googleUser.firstName}'s Company`,
              email: googleUser.email,
            },
          });
          const ownerRole = await this.prisma.role.findUnique({ where: { name: 'Owner' } });
          if (!ownerRole) throw new Error('Owner role not found');
          await this.prisma.userTenant.create({
            data: {
              userId: user.id,
              tenantId: tenant.id,
              roleId: ownerRole.id,
              assignedBy: user.id,
            },
          });
          tenantId = tenant.id;
        }
      } else {
        // Create new user and a tenant
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            googleId: googleUser.id,
            avatar: googleUser.picture,
          },
        });
        
        const tenant = await this.prisma.tenant.create({
          data: {
            name: `${googleUser.firstName}'s Company`,
            email: googleUser.email,
          },
        });
        const ownerRole = await this.prisma.role.findUnique({ where: { name: 'Owner' } });
        if (!ownerRole) throw new Error('Owner role not found');
        await this.prisma.userTenant.create({
          data: {
            userId: user.id,
            tenantId: tenant.id,
            roleId: ownerRole.id,
            assignedBy: user.id,
          },
        });
        tenantId = tenant.id;
      }
    } else {
      // User exists, get their tenant
      const membership = await this.prisma.userTenant.findFirst({
        where: { userId: user.id },
      });
      if (!membership) {
        // Create tenant if user exists but has no tenant (edge case)
        const tenant = await this.prisma.tenant.create({
          data: {
            name: `${user.firstName}'s Company`,
            email: user.email,
          },
        });
        const ownerRole = await this.prisma.role.findUnique({ where: { name: 'Owner' } });
        if (!ownerRole) throw new Error('Owner role not found');
        await this.prisma.userTenant.create({
          data: {
            userId: user.id,
            tenantId: tenant.id,
            roleId: ownerRole.id,
            assignedBy: user.id,
          },
        });
        tenantId = tenant.id;
      } else {
        tenantId = membership.tenantId;
      }
    }

    // Generate tokens and get tenant data
    const tokens = await this.generateTokens(user.id, user.email, tenantId);
    const tenants = await this.getUserTenants(user.id);
    
    return {
      ...tokens,
      tenants,
      currentTenant: tenantId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refresh(refreshToken: string) {
    // Verify refresh token from Redis
    const userId = await this.redis.get(`refresh:${refreshToken}`);
    if (!userId) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const membership = await this.prisma.userTenant.findFirst({
      where: { userId: user.id },
    });
    if (!membership) throw new UnauthorizedException('No tenant');

    // Delete old refresh token
    await this.redis.del(`refresh:${refreshToken}`);

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, membership.tenantId);
    const tenants = await this.getUserTenants(user.id);
    
    return {
      ...tokens,
      tenants,
      currentTenant: membership.tenantId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async getUserTenants(userId: string) {
    const memberships = await this.prisma.userTenant.findMany({
      where: { userId },
      include: {
        tenant: true,
        role: true,
      },
    });
    return memberships.map((m) => ({
      tenantId: m.tenantId,
      tenantName: m.tenant.name,
      role: m.role.name,
      permissions: m.role.permissions,
    }));
  }

  async switchTenant(userId: string, tenantId: string) {
    const membership = await this.prisma.userTenant.findFirst({
      where: { userId, tenantId },
    });
    if (!membership) {
      throw new UnauthorizedException('User not part of this tenant');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    
    const tokens = await this.generateTokens(user.id, user.email, tenantId);
    const tenants = await this.getUserTenants(user.id);
    
    return {
      ...tokens,
      tenants,
      currentTenant: tenantId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private async generateTokens(userId: string, email: string, tenantId: string) {
    const payload = { sub: userId, email, tenantId };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    // Store refresh token in Redis with userId and expiration
    await this.redis.set(`refresh:${refreshToken}`, userId, 60 * 60 * 24 * 7);

    return { accessToken, refreshToken };
  }
}