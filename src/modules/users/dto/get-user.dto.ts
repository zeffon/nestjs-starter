import { PageBaseDto } from '../../../shared/helper/page.helper'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class PageUserDto extends PageBaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  nickname: string
}
