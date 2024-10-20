import { NotFoundException } from '@nestjs/common'
import { ExceptionCode } from '../../common/exception'
import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginTypeEnum } from '../../shared/enum/user.enum'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/token')
  async getToken(@Body() authDto: AuthDto) {
    let token = ''
    switch (authDto.type) {
      case LoginTypeEnum.USER_USERNAME:
        token = await this.authService.userLogin(authDto)
        break
      case LoginTypeEnum.USER_WX:
        token = await this.authService.code2Session(authDto)
        break
      default:
        throw new NotFoundException({ code: ExceptionCode.USER_LOGIN_TYPE_NOT_FOUND })
    }
    return token
  }
}
