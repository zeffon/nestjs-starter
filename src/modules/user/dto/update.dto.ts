import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create.dto'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: `密码长度必须在$constraint1到$constraint2之间`,
  })
  password: string
}
