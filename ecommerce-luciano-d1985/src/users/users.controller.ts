import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Users } from '../users/users.entity';
import { CreateUserDto } from './dto/createUserDto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //roles: guest sin registro ni logueo
  //user registrado y logueado (authguard)
  //admin registrado y logueado (authguard + rolesguard)
  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard) // Asegura que solo usuarios autenticados puedan acceder a esta ruta
  @HttpCode(200)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Omit<Users, 'password'>[]> {
    // convertir a número:
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const validPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    //ver @Si no recibe el parámetro limit, el valor por defecto es 5@.
    const validLimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;
    return this.usersService.getAllUsers(validPage, validLimit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  GetUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() userNewData: any) {
    return this.usersService.updateUser(id, userNewData);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
