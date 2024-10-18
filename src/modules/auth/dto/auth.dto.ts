import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

export class AuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, {
    message: `用户名长度必须在$constraint1到$constraint2之间`,
  })
  username: string

  @ApiProperty({ required: false })
  @IsString()
  @Length(6, 20, {
    message: `密码长度必须在$constraint1到$constraint2之间`,
  })
  password: string

  @ApiProperty({ type: 'number' })
  @IsNumber()
  type = 0
}
