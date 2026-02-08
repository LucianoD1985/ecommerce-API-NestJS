import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    getAllUsers() {
        return 'Todos los usuarios';    
    }
}
