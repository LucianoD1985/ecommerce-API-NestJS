import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { Products } from '../../products/products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Debe ser un UUID válido y no puede estar vacío',
  })
  @IsNotEmpty({ message: 'El id del usuario es requerido' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID válido' })
  userId!: string;

  @ApiProperty({
    description: 'Debe ser un arreglo de productos y no puede estar vacío',
  })
  @IsArray({ message: 'Los productos deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un producto en la orden' })
  products!: Partial<Products[]>; //solo necesito el id del producto para crear la orden, no necesito toda la info del producto
}
