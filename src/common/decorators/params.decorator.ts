import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetTokenUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user ? request.user : null
})
