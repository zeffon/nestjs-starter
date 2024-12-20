import { Injectable } from '@nestjs/common'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserService } from '../user/user.service'

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}

  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility)

    const ability = build()
    return ability
  }
}
