import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '../../modules/user/user.service'
import { RoleCode } from '../../shared/enum/role.enum'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'role_codes'
@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<RoleCode[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const req = context.switchToHttp().getRequest()
    const username = req.user.username
    // TODO: Your Business Logic

    return !username
  }
}

export const Roles = (...roles: RoleCode[]) => SetMetadata(ROLES_KEY, roles)
