import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'
import { ExceptionCode } from './http-exception-code.enum'

function ApiResponseBody<T>(
  result: T,
  errcode: number,
  message: string,
): { result: T; errcode: number; message: string } {
  return { result, errcode, message }
}

/**
 * Response Success, But it not parse Body Entity
 */
export class ResponseSuccessException extends HttpException {
  constructor(
    objectOrError?: string | number | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    const { description, httpExceptionOptions } =
      ResponseSuccessException.parseDescriptionOrOptions(descriptionOrOptions)
    const { result, errcode, message } = ResponseSuccessException.parseObjectOrError(
      objectOrError,
      description,
    )

    const responseBody = ApiResponseBody(result, errcode, message)
    super(responseBody, HttpStatus.OK, httpExceptionOptions)
  }

  private static parseDescriptionOrOptions(descriptionOrOptions?: string | HttpExceptionOptions): {
    description: string
    httpExceptionOptions?: HttpExceptionOptions
  } {
    if (typeof descriptionOrOptions === 'string') {
      return { description: descriptionOrOptions }
    } else if (typeof descriptionOrOptions === 'object' && descriptionOrOptions !== null) {
      return { description: '', httpExceptionOptions: descriptionOrOptions }
    }
    return { description: '' }
  }

  private static parseObjectOrError(
    objectOrError?: string | number | object | any,
    defaultMessage: string = '',
  ): { result: any; errcode: number; message: string } {
    let result: any = null
    let errcode: number = ExceptionCode.OK
    let message: string = defaultMessage

    if (typeof objectOrError === 'object' && objectOrError !== null) {
      result = objectOrError.data ?? result
      errcode = objectOrError.errcode ?? errcode
      message = objectOrError.message ?? message
    } else if (typeof objectOrError === 'string') {
      message = objectOrError
    } else if (typeof objectOrError === 'number') {
      errcode = objectOrError
    }

    return { result, errcode, message }
  }
}
