import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/orders/orders.entity';
import { OrderDetails } from 'src/orders/orderdetails.entity';
import { Users } from 'src/users/users.entity';
import { Products } from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrderDetails, Users, Products])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
