import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersEntity } from './entities/users.entity'
import { ExceptionCode } from '@/common/exception'
import { PageUserDto } from './dto/get-user.dto'
import { conditionFilterBuilder } from '@/shared/helper/db.helper'
import { Paging } from '@/shared/helper/page.helper'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async create(user: Partial<UsersEntity>) {
    const newOne = this.usersRepository.create(user)
    return await this.usersRepository.save(newOne)
  }

  async findAll() {
    return this.usersRepository.find()
  }

  async findPage(query: PageUserDto) {
    const { page, limit, nickname } = query
    const take = limit
    const skip = (page - 1) * take
    const obj = {
      'user.nickname': nickname,
    }
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
    const newQuery = conditionFilterBuilder<UsersEntity>(queryBuilder, obj)
    const [result, total] = await newQuery.take(take).skip(skip).getManyAndCount()
    return new Paging(result, total, page, take)
  }

  async findOne(id: number) {
    const one = await this.usersRepository.findOne({ where: { id } })
    if (!one) {
      throw new NotFoundException({ code: ExceptionCode.USER_NOT_FOUND })
    }
    return one
  }

  async findOneByOpenid(openid: string) {
    return await this.usersRepository.findOne({ where: { openid } })
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    return this.usersRepository.update(id, updateUserDto as UsersEntity)
  }

  async remove(id: number) {
    const one = await this.findOne(id)
    return this.usersRepository.softRemove(one)
  }
}
