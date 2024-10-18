import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'

export class CreatedSuccessException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions)

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.CREATED),
      HttpStatus.CREATED,
      httpExceptionOptions
    )
  }
}

export class GetSuccessException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions)

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.OK),
      HttpStatus.OK,
      httpExceptionOptions
    )
  }
}

export class UpdatedSuccessException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions)

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.OK),
      HttpStatus.OK,
      httpExceptionOptions
    )
  }
}

export class DeletedSuccessException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions
  ) {
    const { description, httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions)

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.OK),
      HttpStatus.OK,
      httpExceptionOptions
    )
  }
}
