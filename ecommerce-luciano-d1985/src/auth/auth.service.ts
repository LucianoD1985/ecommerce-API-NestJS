import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/createUserDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  getAuth() {
    return 'Autenticación';
  }
  // REGISTRO
  async signUp(newUserData: CreateUserDto) {
    const { email, password } = newUserData;
    if (!email || !password) {
      throw new BadRequestException('Email y Password son requeridos');
    }

    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (foundUser) {
      throw new BadRequestException('El email ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //guardar en DB
    return await this.usersRepository.addUser({
      ...newUserData,
      password: hashedPassword,
    });
  }

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Credenciales incorrectas');
    }
    //verificar que el usuario exista
    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (!foundUser) {
      //throw new BadRequestException('asdasda');
      throw new ForbiddenException('Credenciales inválidas');
    }
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      //throw new BadRequestException('asdasda');
      throw new ForbiddenException('Credenciales inválidas');
    }

    //firmo el token
    const payload = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      roles: foundUser.isAdmin ? 'admin' : 'user',
    };
    const token = this.jwtService.sign(payload);
    //enviar token al front
    return {
      message: 'Usuario logueado',
      token: token,
    };
  }
}
