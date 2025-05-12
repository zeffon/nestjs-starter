import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ExceptionCode } from './http-exception-code.enum'
import CODE_DICT from './http-exception-code'

interface ResponseExceptionProps {
  message?: string | string[]
  error?: string
  errcode?: number
  result?: any
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 打印错误日志
    this.logger.error(
      `Unhandled exception on [${request.method}] ${request.url}`,
      (exception instanceof Error ? exception.stack : String(exception)) ?? 'Unknown error',
    )

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let errcode = ExceptionCode.UNKNOWN_ERROR
    let message = 'Internal Server Error'
    let result = null

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      let { errcode, message, result } = makeHttpExceptionCodeAndMessage(status, exception)
      response.status(status).json({
        errcode,
        message,
        result,
        request: `${request.method} ${request.path}`,
      })
    } else {
      message = (exception as Error).message || message
      response.status(status).json({
        errcode,
        message,
        result,
        request: `${request.method} ${request.path}`,
      })
    }
  }
}

const makeHttpExceptionCodeAndMessage = (status: number, exception: HttpException) => {
  const exceptionResponse = exception.getResponse() as ResponseExceptionProps
  let errcode = exceptionResponse.errcode

  if (!errcode && status) {
    if (status === 400) {
      errcode = ExceptionCode.BAD_REQUEST
    } else if (status === 401) {
      errcode = ExceptionCode.UNAUTHORIZED
    } else if (status === 403) {
      errcode = ExceptionCode.FORBIDDEN
    } else if (status === 404) {
      errcode = ExceptionCode.NOT_FOUND
    } else if (status === 500) {
      errcode = ExceptionCode.UNKNOWN_ERROR
    }
  }

  let message: string | string[] = exception.message || exception.name
  if (exceptionResponse.message) {
    message = exceptionResponse.message
  } else if (errcode) {
    message = CODE_DICT.get(+errcode) || message
  }

  const result = exceptionResponse.result || null
  return { errcode, message, result }
}
