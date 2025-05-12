import { NotFoundException, Query } from '@nestjs/common'
import { ExceptionCode } from '../../common/exception'
import { Controller, Post, Get, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginTypeEnum } from '../../shared/enum/user.enum'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/token/verify')
  verifyToken(@Query('token') token: string) {
    this.authService.verifyToken(token)
  }

  @Post('/token')
  async getToken(@Body() authDto: AuthDto) {
    let token = ''
    switch (authDto.type) {
      case LoginTypeEnum.WechatMini:
        token = await this.authService.code2Session(authDto)
        break
      case LoginTypeEnum.UserLogin:
        token = await this.authService.userLogin(authDto)
        break
      default:
        throw new NotFoundException({ errcode: ExceptionCode.USER_LOGIN_TYPE_NOT_FOUND })
    }
    return token
  }
}
