import { RoleCode } from '../../shared/enum/role.enum'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'role_codes'

export const Roles = (...roles: RoleCode[]) => SetMetadata(ROLES_KEY, roles)
