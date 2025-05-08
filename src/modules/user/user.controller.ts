import { Controller, Get, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { JwtGuard } from '../../common/guards'
import { UpdateUserDto, PageUserDto } from './dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { GetUid } from '../../common/decorators/params.decorator'

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get('page')
  findPage(@Query() query: PageUserDto) {
    return this.userService.findPage(query)
  }

  @Get('me')
  findMe(@GetUid() uid: number) {
    return this.userService.findOne(uid)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
