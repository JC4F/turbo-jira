import { RolesGuard } from '@/common/guards';
import { Role } from '@/constant';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

export function Auth(roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
