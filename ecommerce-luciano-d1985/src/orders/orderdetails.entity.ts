import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from '../orders/orders.entity';
import { Products } from '../products/products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDERDETAILS',
})
export class OrderDetails {
  @ApiProperty({
    description: 'Identificador único del detalle de la orden, UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Precio de la orden',
  })
  @Column({
    type: 'decimal',
    precision: 10, //* 1234567890.99
    scale: 2,
    nullable: false,
  })
  price!: number;

  @OneToOne(() => Orders, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order!: Orders;

  @ManyToMany(() => Products)
  @JoinTable({
    name: 'ORDERDETAILS_PRODUCTS',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'orderDetails_id',
      referencedColumnName: 'id',
    },
  })
  products!: Products[];
}
