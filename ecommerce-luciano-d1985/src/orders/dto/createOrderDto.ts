import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { Products } from '../../products/products.entity';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El id del usuario es requerido' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID válido' })
  userId: string;

  @IsArray({ message: 'Los productos deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un producto en la orden' })
  products: Partial<Products[]>; //solo necesito el id del producto para crear la orden, no necesito toda la info del producto
}
