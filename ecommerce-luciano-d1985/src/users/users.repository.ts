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
    this.ormUsersRepository.remove(foundUser);
    return foundUser.id;
  }
}

//import { Injectable } from '@nestjs/common';

//export interface IUser {
// id: string; // Cambié el tipo de id a string para permitir UUIDs
//  email: string;
//  name: string;
// password: string;
// address: string;
// phone: string;
// country?: string | undefined;
// city?: string | undefined;
//}

//const users: IUser[] = [
// {
//   id: '1',
//   email: 'homer.simpson@nuclear-plant.com',
//   name: 'Homer Simpson',
//   password: 'password123',
//   address: '742 Evergreen Terrace',
//   phone: '555-0113',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '2',
//   email: 'marge.simpson@homemail.com',
//   name: 'Marge Simpson',
//   password: 'homie_forever',
//   address: '742 Evergreen Terrace',
//  phone: '555-0113',
//  country: 'USA',
//   city: 'Springfield',
// },
//  {
//   id: '3',
//   email: 'el_barto@skate.com',
//   name: 'Bart Simpson',
//   password: 'eat_my_shorts',
//   address: '742 Evergreen Terrace',
//  phone: '555-0113',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '4',
//   email: 'lisa.smart@jazz.org',
//   name: 'Lisa Simpson',
//   password: 'sax_player_8',
//   address: '742 Evergreen Terrace',
//   phone: '555-0113',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '5',
//  email: 'maggie.pacifier@baby.com',
//   name: 'Maggie Simpson',
//   password: 'suck_suck_suck',
//  address: '742 Evergreen Terrace',
//   phone: '555-0113',
//   country: 'USA',
//   city: 'Springfield',
//  },
//  {
////   id: '6',
////   email: 'ned.flanders@leftorium.com',
////   name: 'Ned Flanders',
////   password: 'didilly_doodilly',
////   address: '744 Evergreen Terrace',
////   phone: '555-0150',
////   country: 'USA',
////   city: 'Springfield',
//// },
//// {
////   id: '7',
////    email: 'c.m.burns@powerplant.com',
//   name: 'Charles Montgomery Burns',
//   password: 'excellent_1890',
//   address: '1000 Mammon Lane',
//   phone: '555-0001',
//   country: 'USA',
// },
//   city: 'Springfield',
// id: '8',
// {
//   name: 'Waylon Smithers',
//   email: 'waylon.smithers@powerplant.com',
//    password: 'i_love_monty',
//   phone: '555-0002',
//   address: 'Apartment 4, 123 Luxury Lane',
//   city: 'Springfield',
//   country: 'USA',
//   {
// },
//   id: '9',
//   email: 'moe.szyslak@taverna.com',
//   name: 'Moe Szyslak',
//   password: 'ugly_guy_99',
//   address: 'Walnut St. 567',
//   phone: '555-7334',
//   country: 'USA',
//   city: 'Springfield',
// },
//  {
//   id: '10',
//   email: 'barney.gumble@beer.com',
//   name: 'Barney Gumble',
//   password: 'belch_king',
//   address: 'Moes Tavern Backroom',
//   phone: '555-1234',
//   country: 'USA',
//   city: 'Springfield',
//  },
// {
//   id: '11',
//   email: 'krusty.clown@tv.com',
//   name: 'Herschel Krustofsky',
//   password: 'hey_hey_kids',
//   address: '123 Krustylu Studios',
//   phone: '555-9988',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '12',
//   email: 'milhouse.vanhouten@duds.com',
//    name: 'Milhouse Van Houten',
//   password: 'everything_coming_up',
//   address: '316 Maple St.',
//   phone: '555-4567',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '13',
//   email: 'apu.nahas@kwikemart.com',
//   name: 'Apu Nahasapeemapetilon',
//  password: 'thank_you_come_again',
//   address: 'Kwik-E-Mart Plaza',
//  phone: '555-0909',
//   country: 'USA',
//   city: 'Springfield',
//  },
// {
//   id: '14',
//   email: 'seymour.skinner@school.edu',
//   name: 'Seymour Skinner',
//   password: 'mother_is_watching',
//   address: '330 Boeing St.',
//    phone: '555-8822',
//   country: 'USA',
//   city: 'Springfield',
//  },
//  {
//    id: '15',
//    email: 'edna.krabappel@school.edu',
//    name: 'Edna Krabappel',
//   password: 'ha_ha_ha_ha',
//   address: 'Apartment 2B',
//   phone: '555-7711',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '16',
//   email: 'clancy.wiggum@police.gov',
//   name: 'Clancy Wiggum',
//   password: 'donuts_forever',
//   address: 'Police HQ 1',
//   phone: '911-000',
//   country: 'USA',
//  city: 'Springfield',
//  },
// {
//   id: '17',
//   email: 'nelson.muntz@bullies.com',
//   name: 'Nelson Muntz',
//   password: 'ha_ha_loser',
//   address: 'Trailer Park Lot 12',
//   phone: '555-1111',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//   id: '18',
//   email: 'sideshow.bob@prison.com',
//   name: 'Robert Terwilliger',
//   password: 'kill_bart_2026',
//   address: 'Cell 402, Springfield Penitentiary',
//   phone: '555-0666',
//   country: 'USA',
//   city: 'Springfield',
// },
// {
//  id: '19',
//  email: 'groundskeeper.willie@school.edu',
//   name: 'Willie',
//  password: 'scotland_n1',
//  address: 'Shack behind School',
//   phone: '555-3344',
//   country: 'Scotland',
//   city: 'Springfield',
// },
// {
//  id: '20',
// email: 'kent.brockman@news6.com',
// name: 'Kent Brockman',
//  password: 'eye_on_springfield',
//  address: 'Kent Mansion 1',
//  phone: '555-NEWS',
// country: 'USA',
// city: 'Springfield',
//},
//];

//@Injectable()
//export class UsersRepository {
//  async getAllUsers(
//    page: number,
//    limit: number,
//  ): Promise<Omit<IUser, 'password'>[]> {
//   const start = (page - 1) * limit;
//   const end = start + limit;
//   const usersList = users.slice(start, end);
//   return usersList.map(({ password, ...userNoPassword }) => userNoPassword);
//   //sacó el await entre return y userList por que va a ir arriba después
// }
// getUserById(id: string) {
//   //verificar que existe
//  const foundUser = users.find((user) => user.id === id);
//  if (!foundUser) return `No se encontró usuario con id ${id}`;
//  //retornar el usuario sin pass
//  const { password, ...userNoPassword } = foundUser;
//  return foundUser;
// }

//ver
//// getUserByEmail(email: string) {
////  //verificar que existe
//// const foundUser = users.find((user) => user.email === email);
//// return foundUser;
//if (!foundUser) return `No se encontró usuario con email ${email}`;
//retornar el usuario sin pass
//const { password, ...userNoPassword } = foundUser;
//return userNoPassword;
////}
////addUser(newUserData: any) {
//extra credit que ningun usuario ya este registrado con el mail
//// users.push({ ...newUserData, id: newUserData.email });
//// return newUserData.email;
////}
////updateUser(id: string, userNewData: any) {
//verificar que existe
//// const foundUser = users.find((user) => user.id === id);
//// if (!foundUser) return `No se encontró usuario con id ${id}`;

//si existe actualizar el usuario con los nuevos datos
// Object.assign(foundUser, userNewData);
//  return id;
//}
//deleteUser(id: string) {
//verificar que existe
//  const foundIndex = users.findIndex((user) => user.id === id);
// if (foundIndex === -1) return `No se encontró usuario con id ${id}`;
// users.splice(foundIndex, 1);
// return id;
//}
//}
