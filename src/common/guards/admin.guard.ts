import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '../../modules/user/user.service'

@Injectable()
export default class AdminGuard implements CanActivate {
  constructor() {
    //
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const username = req.user.username
    // TODO: Your Business Logic
    return !username
  }
}
