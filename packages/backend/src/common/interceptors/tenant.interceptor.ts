import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let tenantId = req.headers['x-tenant-id'];

    if (!tenantId && req.user) {
      tenantId = req.user.tenantId;
    }

    if (!tenantId && req.user) {
      const membership = await this.prisma.userTenant.findFirst({
        where: { userId: req.user.userId },
        select: { tenantId: true },
      });
      if (membership) {
        tenantId = membership.tenantId;
      }
    }

    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    req.tenantId = tenantId;
    return next.handle();
  }
}