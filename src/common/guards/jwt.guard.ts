import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler())
    if (skipAuth) {
      return true
    }

    return super.canActivate(context)
  }
}

export const SkipAuthGuard = () => SetMetadata('skipAuth', true)
