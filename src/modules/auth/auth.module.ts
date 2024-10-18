import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigEnum } from '../../shared/enum/config.enum'
import { JwtStrategy } from './auth.strategy'
import { AuthService } from './auth.service'
import { CaslAbilityService } from './casl-ability.service'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../../modules/users/users.module'

@Module({
  imports: [
    HttpModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(ConfigEnum.SECRET),
          signOptions: configService.get(ConfigEnum.EXPIRES_IN),
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CaslAbilityService],
  providers: [AuthService, JwtStrategy, CaslAbilityService],
  controllers: [AuthController],
})
export class AuthModule {}
