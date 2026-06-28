import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
//import { OrderDetails } from './orderdetails.entity';
//import { CreateOrderDto } from './dto/createOrderDto';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  getOrderById(id: string) {
    return this.ordersRepository.getOrderById(id);
  }
  //newOrderData es la estructura de la consigna
  addOrder(newOrderData: any) {
    return this.ordersRepository.addOrder(newOrderData);
  }
}
