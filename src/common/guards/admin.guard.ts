import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UsersService } from '../../modules/users/users.service'

@Injectable()
export default class AdminGuard implements CanActivate {
  constructor() {
    //
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const username = req.user.username

    return !username
  }
}
