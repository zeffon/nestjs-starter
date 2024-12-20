import { Entity, Column } from 'typeorm'
import { BaseEntity } from '../../../common/constants/base-entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ length: 50 })
  openid: string

  @Column({ length: 255 })
  nickname: string

  @Column({ name: 'avatar_url', length: 255 })
  avatarUrl: string

  @Column({ nullable: true })
  remark: string
}
