import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogginUserDto } from '../users/dto/createUserDto';
import { CreateUserDto } from '../users/dto/createUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }

  @Post('signin')
  signIn(@Body() credentials: LogginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  signUp(@Body() newUserData: CreateUserDto) {
    return this.authService.signUp(newUserData);
  }
}
