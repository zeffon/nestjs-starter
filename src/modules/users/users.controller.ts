import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtGuard } from '../../common/guards'
import { PageUserDto } from './dto/get-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { GetUid } from '../../common/decorators/params.decorator'

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get('page')
  findPage(@Query() query: PageUserDto) {
    return this.usersService.findPage(query)
  }

  @Get('me')
  findMe(@GetUid() uid: number) {
    return this.usersService.findOne(uid)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
