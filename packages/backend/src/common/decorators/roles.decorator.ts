import { SetMetadata } from '@nestjs/common';

export const Roles = (...permissions: string[]) => SetMetadata('permissions', permissions);