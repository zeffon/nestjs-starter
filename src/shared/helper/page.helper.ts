import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20

export class PageBaseDto {
  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value)
    return isNaN(parsedValue) ? DEFAULT_PAGE : parsedValue
  })
  page = DEFAULT_PAGE

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value)
    return isNaN(parsedValue) ? DEFAULT_LIMIT : parsedValue
  })
  limit = DEFAULT_LIMIT
}

export class Paging<T> {
  page = DEFAULT_PAGE
  limit = DEFAULT_LIMIT
  total = 0
  pageTotal = 0
  items: T[] = []
  constructor(items: T[], total: number, page: number, limit: number) {
    this.page = page
    this.limit = limit
    this.total = total
    this.pageTotal = Math.ceil(total / limit)
    this.items = items
  }
}
