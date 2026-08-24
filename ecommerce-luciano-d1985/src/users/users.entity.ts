import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from '..//orders/orders.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'USERS',
})
export class Users {
  @ApiProperty({
    description: 'Identificador único del usuario, UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Nombre de usuario',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
  })
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password!: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
  })
  @Column({
    type: 'int',
  })
  phone!: number;

  @ApiProperty({
    description: 'País del usuario',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  country!: string;

  @ApiProperty({
    description: 'Dirección del usuario',
  })
  @Column({
    type: 'text',
  })
  address!: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  city!: string;

  @Column({
    default: false,
  })
  isAdmin!: boolean;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders!: Orders[];
}
