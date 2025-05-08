import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { ExceptionCode } from '../../common/exception'
import { PageUserDto } from './dto/get-user.dto'
import { conditionFilterBuilder } from '../../shared/helper/db.helper'
import { Paging } from '../../shared/helper/page.helper'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(one: Partial<UserEntity>) {
    const newOne = this.userRepository.create(one)
    return await this.userRepository.save(newOne)
  }

  async findAll() {
    return this.userRepository.find()
  }

  async findPage(query: PageUserDto) {
    const { page, limit, nickname } = query
    const take = limit
    const skip = (page - 1) * take
    const obj = {
      'user.nickname': nickname,
    }
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
    const newQuery = conditionFilterBuilder<UserEntity>(queryBuilder, obj)
    const [result, total] = await newQuery.take(take).skip(skip).getManyAndCount()
    return new Paging(result, total, page, take)
  }

  async findOne(id: number) {
    const one = await this.userRepository.findOne({ where: { id } })
    if (!one) {
      throw new NotFoundException({ errcode: ExceptionCode.USER_NOT_FOUND })
    }
    return one
  }

  async findOneByOpenid(openid: string) {
    return await this.userRepository.findOne({ where: { openid } })
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    return this.userRepository.update(id, updateUserDto as UserEntity)
  }

  async remove(id: number) {
    const one = await this.findOne(id)
    return this.userRepository.softRemove(one)
  }
}
