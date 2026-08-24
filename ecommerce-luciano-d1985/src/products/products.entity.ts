import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from '../categories/categories.entity';
import { OrderDetails } from '../orders/orderdetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'PRODUCTS',
})
export class Products {
  @ApiProperty({
    description: 'Identificador único del producto, UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Nombre del producto',
  })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: 'Descripción del producto',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  description!: string;

  @ApiProperty({
    description: 'Precio del producto',
  })
  @Column({
    type: 'decimal',
    precision: 10, //* 1234567890.99
    scale: 2,
    nullable: false,
  })
  price!: number;

  @ApiProperty({
    description: 'Stock del producto',
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  stock!: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
  })
  @Column({
    type: 'text',
    default:
      'https://www.pexels.com/es-es/foto/firmar-tipografia-hojas-texto-4439444/',
  })
  imageUrl!: string;

  @ManyToOne(() => Categories, (categories) => categories.products)
  @JoinColumn({ name: 'categories_id' })
  category!: Categories;

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails!: OrderDetails[];
}
export { OrderDetails };
