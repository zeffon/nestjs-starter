import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import CODE from './http-exception-code'
import { ExceptionCode } from './http-exception-code.enum'

interface ResponseExceptionProps {
  message?: string | string[]
  error?: string
  errcode?: number
  result?: any
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const { errcode, message, result } = makeCodeAndMessage(exception)

    response.status(status).json({
      errcode,
      message,
      result,
      request: `${request.method} ${request.path}`,
    })
  }
}

const makeCodeAndMessage = (exception: HttpException) => {
  const exceptionResponse = exception.getResponse() as ResponseExceptionProps
  let errcode = exceptionResponse.errcode || ExceptionCode.NOT_FOUND_CODE

  let message: string | string[] = exception.message || exception.name
  if (exceptionResponse.message) {
    message = exceptionResponse.message
  } else if (errcode) {
    message = CODE.get(+errcode) || message
  }

  if (exceptionResponse.errcode) {
    if (exceptionResponse.errcode === 400) {
      errcode = ExceptionCode.BAD_REQUEST
    } else if (exceptionResponse.errcode === 401) {
      errcode = ExceptionCode.UNAUTHORIZED
      message = CODE.get(+errcode) || message
    } else if (exceptionResponse.errcode === 403) {
      errcode = ExceptionCode.FORBIDDEN
      message = CODE.get(+errcode) || message
    } else if (exceptionResponse.errcode === 404) {
      errcode = ExceptionCode.NOT_FOUND
      message = CODE.get(+errcode) || message
    } else if (exceptionResponse.errcode === 500) {
      errcode = ExceptionCode.UNKNOWN_ERROR
    }
  }

  const result = exceptionResponse.result || null
  return { errcode, message, result }
}
