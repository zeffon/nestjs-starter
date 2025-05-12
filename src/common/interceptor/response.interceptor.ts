import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { ExceptionCode, CODE_DICT } from '../exception'

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: any) => {
        const meta = data?.__meta__
        let result = data?.data ?? data
        // buildSuccessResponse设置data为null 或者 在container层没有任何return数据的 情况
        if (data?.data === null || data === undefined) {
          result = null
        }

        const errcode = meta?.errcode ?? ExceptionCode.OK
        const message = meta?.message ?? CODE_DICT.get(errcode) ?? ''

        return { result, errcode, message }
      }),
    )
  }
}

export interface BuildSuccessResponseProps {
  data?: any
  errcode?: number
  message?: string
}
/**
 * 在已有封装 SuccessResponseInterceptor 拦截器已经实现对返回数据的
 * 1.数据格式统一
 * 2.自动处理类实例的序列化(使@Exclude()、@Expose()生效)
 * 而buildSuccessResponse函数存在的意义：可以在return buildSuccessResponse({...}) 自定义errcode和message
 *
 * 区别：throw new ResponseSuccessException({ data })无法自动处理类实例的序列化，而SuccessResponseInterceptor可以
 * @param options
 * @returns
 */
export const buildSuccessResponse = (options?: BuildSuccessResponseProps) => {
  const { data = null, errcode = ExceptionCode.OK, message } = options || {}
  const statusMessage = message !== undefined ? message : (CODE_DICT.get(errcode) ?? '')
  return {
    data,
    __meta__: {
      errcode,
      message: statusMessage,
    },
  }
}
