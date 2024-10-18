import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { dateTransformer } from '@/shared/transformers/date.transformer'

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    transformer: dateTransformer(),
  })
  @Exclude()
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    transformer: dateTransformer(),
  })
  @Exclude()
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    transformer: dateTransformer(),
  })
  @Exclude()
  deletedAt: Date
}
