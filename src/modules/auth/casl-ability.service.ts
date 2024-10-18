import { Injectable } from '@nestjs/common'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UsersService } from '../users/users.service'

@Injectable()
export class CaslAbilityService {
  constructor(private usersService: UsersService) {}

  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility)

    const ability = build()
    return ability
  }
}
