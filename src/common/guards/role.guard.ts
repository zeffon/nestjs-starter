import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from '@/modules/users/users.service'
import { RoleCode } from '@/shared/enum/role.enum'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'role_codes'
@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {}

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

    return !username
  }
}

export const Roles = (...roles: RoleCode[]) => SetMetadata(ROLES_KEY, roles)
