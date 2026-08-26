/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      skip: skip,
      take: limit,
    });
    return allUsers.map(({ password, ...userNoPassword }) => userNoPassword);
  }

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

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.ormUsersRepository.findOneBy({ email: email });
  }

  async addUser(newUserData: CreateUserDto): Promise<string> {
    const savedUser = await this.ormUsersRepository.save(newUserData);
    return savedUser.id;
  }

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

    try {
      await this.ormUsersRepository.remove(foundUser);
    } catch (error) {
      throw new ConflictException(
        'No se puede eliminar el usuario porque tiene órdenes asociadas',
      );
    }

    return foundUser.id;
  }
}
