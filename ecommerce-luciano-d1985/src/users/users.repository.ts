/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/users.entity';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private ormUsersRepository: Repository<Users>,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    const skip = (page - 1) * limit;
    const allUsers = await this.ormUsersRepository.find({
      skip: skip, //salta los registros anteriores
      take: limit, //limita la cantidad de registros devueltos
    });
    return allUsers.map(({ password, ...userNoPassword }) => userNoPassword);
  }
  // async getUserById(id: string): Promise<Omit<Users, 'password'> | string> {
  //   const foundUser = await this.ormUsersRepository.findOne({
  //     where: { id },
  //     relations: {
  //       orders: {
  //         orderDetails: {
  //           products: true,
  //         },
  //       },
  //     },
  //   });
  //   if (!foundUser) return `No se encontró usuario con id ${id}`;
  //   const { password, ...userNoPassword } = foundUser;
  //   return userNoPassword;
  // }
  async getUserById(id: string): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    const foundUser = await this.ormUsersRepository.findOne({
      where: { id },
      relations: {
        orders: {
          orderDetails: {
            products: true,
          },
        },
      },
    });
    if (!foundUser)
      throw new NotFoundException(`No se encontró usuario con id ${id}`);
    const { password, isAdmin, ...filteredUser } = foundUser;
    return filteredUser;
  }

  // IMPORTANTE : retorna un usuario o null => invocado por Auth, no hay que cortar la ejecución
  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.ormUsersRepository.findOneBy({ email: email });
  }
  //return await this.ormUsersRepository.findOneBy({ email });
  async addUser(newUserData: CreateUserDto): Promise<string> {
    const savedUser = await this.ormUsersRepository.save(newUserData);
    return savedUser.id;
  }
  //arriba ver tiene que devolver el usuario sin password, pero como lo uso en auth.service para guardar el id del token, lo dejo así por ahora

  async updateUser(
    id: string,
    newUserData: Users,
  ): Promise<Omit<Users, 'password'>> {
    const user = await this.ormUsersRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`No se encontró usuario con id ${id}`);
    const mergedUser = this.ormUsersRepository.merge(user, newUserData);
    const savedUser = await this.ormUsersRepository.save(mergedUser);
    const { password, ...userNoPassword } = savedUser;
    return userNoPassword;
  }

  async deleteUser(id: string) {
    const foundUser = await this.ormUsersRepository.findOneBy({ id });
    if (!foundUser)
      throw new NotFoundException(`No existe usuario con id ${id}`);
    await this.ormUsersRepository.remove(foundUser);
    return foundUser.id;
  }
}
