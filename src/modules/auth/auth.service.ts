import { BadRequestException, Injectable } from '@nestjs/common'
import { ExceptionCode } from '@/common/exception'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { ConfigEnum } from '@/shared/enum/config.enum'
import { UsersService } from '@/modules/users/users.service'
import { AuthDto } from './dto/auth.dto'
import { UsersEntity } from '../users/entities/users.entity'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private httpService: HttpService,
    private usersService: UsersService
  ) {}

  async userLogin(authDto: AuthDto) {
    // TODO
    console.log(authDto)
    return await this.jwt.signAsync({
      username: 'user.username',
      sub: 'user.id',
    })
  }

  async code2Session(authDto: AuthDto) {
    const WX = this.configService.get(ConfigEnum.WX_CONFIG)
    const formatUrl = `${WX.SESSION_URL}?appid=${WX.APP_ID}&secret=${WX.APP_SECRET}&js_code=${authDto.username}&grant_type=authorization_code`

    const { data } = await firstValueFrom(this.httpService.get(formatUrl))
    if (data.errcode && data.errcode !== 1) {
      throw new BadRequestException({ code: ExceptionCode.WX_INNER_LOGIN_FAIL })
    }
    return this.openid2User(data.openid)
  }

  async openid2User(openid: string) {
    if (openid == null || openid === undefined) {
      throw new BadRequestException({ code: ExceptionCode.WX_INNER_LOGIN_FAIL })
    }
    const user = await this.usersService.findOneByOpenid(openid)
    if (user) {
      return this.generateToken(user)
    }
    const avatarUrl = `https://cdn.zeffon.cn/nickname/avatar/default-${
      Math.floor(Math.random() * 5) + 1
    }.png`
    const nickname = '微信用户'
    const newUser = await this.usersService.create({
      openid,
      nickname,
      avatarUrl,
    })
    return this.generateToken(newUser)
  }

  async generateToken(user: UsersEntity) {
    return await this.jwt.signAsync({
      username: user.openid,
      sub: user.id,
    })
  }
}
