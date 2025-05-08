import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserEntity } from './entities/user.entity'
import { ExceptionCode } from '../../common/exception'
import { PageUserDto, UpdateUserDto } from './dto'
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
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
    if (nickname) {
      queryBuilder.where('user.nickname LIKE :nickname', { nickname: `%${nickname}%` })
    }
    queryBuilder.skip((page - 1) * limit).take(limit)
    const [result, total] = await queryBuilder.getManyAndCount()
    return new Paging(result, total, page, limit)
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
