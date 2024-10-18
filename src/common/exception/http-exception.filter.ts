import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import CODE from './http-exception-code'
import { ExceptionCode } from './http-exception-code.enum'

interface ExceptionResponseProps {
  code?: number
  message?: string | string[]
  error?: string
  statusCode?: number
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const [statusCode, message] = makeCodeAndMessage(exception)

    response.status(status).json({
      statusCode,
      message,
      request: `${request.method} ${request.path}`,
    })
  }
}

const makeCodeAndMessage = (exception: HttpException) => {
  const exceptionResponse = exception.getResponse() as ExceptionResponseProps
  let statusCode = exceptionResponse.code || ExceptionCode.NOT_FOUND_CODE

  let message: string | string[] = exception.message || exception.name
  if (exceptionResponse.message) {
    message = exceptionResponse.message
  } else if (statusCode) {
    message = CODE.get(+statusCode) || message
  }

  if (exceptionResponse.statusCode) {
    if (exceptionResponse.statusCode === 400) {
      statusCode = ExceptionCode.BAD_REQUEST
    } else if (exceptionResponse.statusCode === 401) {
      statusCode = ExceptionCode.UNAUTHORIZED
      message = CODE.get(+statusCode) || message
    } else if (exceptionResponse.statusCode === 403) {
      statusCode = ExceptionCode.FORBIDDEN
      message = CODE.get(+statusCode) || message
    } else if (exceptionResponse.statusCode === 404) {
      statusCode = ExceptionCode.NOT_FOUND
      message = CODE.get(+statusCode) || message
    } else if (exceptionResponse.statusCode === 500) {
      statusCode = ExceptionCode.UNKNOWN_ERROR
    }
  }

  return [statusCode, message]
}
