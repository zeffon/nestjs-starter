import { NotFoundException, UseGuards } from '@nestjs/common'
import { ExceptionCode } from '../../common/exception'
import { Controller, Post, Get, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LoginTypeEnum } from '../../shared/enum/user.enum'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { JwtGuard } from '../../common/guards'
import { GetUid } from 'src/common/decorators/params.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/token/refrsh')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async verifyToken(@GetUid() uid: number) {
    return await this.authService.generateToken(uid)
  }

  @Post('/token')
  async getToken(@Body() authDto: AuthDto) {
    let token = ''
    switch (authDto.type) {
      case LoginTypeEnum.USER_WX:
        token = await this.authService.code2Session(authDto)
        break
      case LoginTypeEnum.USER_USERNAME:
        token = await this.authService.userLogin(authDto)
        break
      default:
        throw new NotFoundException({ errcode: ExceptionCode.USER_LOGIN_TYPE_NOT_FOUND })
    }
    return token
  }
}
