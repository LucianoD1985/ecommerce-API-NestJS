import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  // Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Users } from '../users/users.entity';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/createUserDto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Omit<Users, 'password'>[]> {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const validPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const validLimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;
    return this.usersService.getAllUsers(validPage, validLimit);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  GetUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userNewData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, userNewData);
  }

  //@ApiBearerAuth()
  //@Put(':id')
  //@UseGuards(AuthGuard)
  //@HttpCode(200)
  //updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() userNewData: any) {
  // return this.usersService.updateUser(id, userNewData);
  //}
  @ApiBearerAuth()
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
