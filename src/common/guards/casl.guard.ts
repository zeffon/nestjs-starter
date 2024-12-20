import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  CaslHandlerType,
  CHECK_POLICIES_KEY,
  PolicyHandlerCallback,
} from '../../common/decorators/casl.decorator'
import { CaslAbilityService } from '../../modules/auth/casl-ability.service'

@Injectable()
export default class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers = this.reflector.getAllAndMerge<PolicyHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [context.getHandler(), context.getClass()],
    )
    const canHandlers = this.reflector.getAllAndMerge<any[]>(CHECK_POLICIES_KEY.CAN, [
      context.getHandler(),
      context.getClass(),
    ]) as CaslHandlerType
    const cannotHandlers = this.reflector.getAllAndMerge<any[]>(CHECK_POLICIES_KEY.CANNOT, [
      context.getHandler(),
      context.getClass(),
    ]) as CaslHandlerType
    // 判断，如果用户未设置上述的任何一个，那么就直接返回true
    if (!handlers || !canHandlers || !cannotHandlers) {
      return true
    }
    const req = context.switchToHttp().getRequest()
    if (req.user) {
      // 获取当前用户的权限
      const ability = await this.caslAbilityService.forRoot(req.user.username)

      let flag = true
      if (handlers) {
        flag = flag && handlers.every((handler) => handler(ability))
      }
      if (flag && canHandlers) {
        if (canHandlers instanceof Array) {
          flag = flag && canHandlers.every((handler) => handler(ability))
        } else if (typeof canHandlers === 'function') {
          flag = flag && canHandlers(ability)
        }
      }
      if (flag && cannotHandlers) {
        if (cannotHandlers instanceof Array) {
          flag = flag && cannotHandlers.every((handler) => handler(ability))
        } else if (typeof cannotHandlers === 'function') {
          flag = flag && cannotHandlers(ability)
        }
      }
      return flag
    } else {
      return false
    }
  }
}
