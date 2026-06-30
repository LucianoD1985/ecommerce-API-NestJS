/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from '../users/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    return this.usersRepository.getAllUsers(page, limit);
  }
  getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }

  updateUser(id: string, userNewData: any) {
    return this.usersRepository.updateUser(id, userNewData);
  }
  deleteUser(id: string) {
    return this.usersRepository.deleteUser(id);
  }
}
