import { BadRequestException, Injectable } from '@nestjs/common'
import { ExceptionCode } from '../../common/exception'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { ConfigEnum } from '../../shared/enum/config.enum'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  async userLogin(authDto: AuthDto) {
    // TODO
    console.log(authDto)
    const uid = 1
    return await this.generateToken(uid)
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
    const user = await this.userService.findOneByOpenid(openid)
    if (user) {
      return this.generateToken(user.id)
    }
    const newUser = await this.userService.create({
      openid,
      nickname: 'nickname',
    })
    return this.generateToken(newUser.id)
  }

  async generateToken(uid: number) {
    return await this.jwt.signAsync({
      uid,
    })
  }
}
