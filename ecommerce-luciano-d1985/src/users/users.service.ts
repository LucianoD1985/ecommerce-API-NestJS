import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from '../users/users.entity';
//import { CreateUserDto } from './dto/createUserDto';

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
  //addUser(newUserData: CreateUserDto) {
  // return this.usersRepository.addUser(newUserData);
  //ESTE ESTABA CON EL @POST() addUser}
  updateUser(id: string, userNewData: any) {
    return this.usersRepository.updateUser(id, userNewData);
  }
  deleteUser(id: string) {
    return this.usersRepository.deleteUser(id);
  }
}
