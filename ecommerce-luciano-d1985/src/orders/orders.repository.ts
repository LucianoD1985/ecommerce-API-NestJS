import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from '../orders/orderdetails.entity';
import { Orders } from '../orders/orders.entity';
import { Users } from '../users/users.entity';
import { Products } from '../products/products.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ormOrdersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails) //
    private ormOrderDetailRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private ormUsersRepository: Repository<Users>,
    @InjectRepository(Products)
    private ormProductsRepository: Repository<Products>,
  ) {}

  async getOrderById(id: string): Promise<Orders | string> {
    const order = await this.ormOrdersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) {
      return `Orden con ID ${id} no encontrada`;
    }

    return order;
  }

  async addOrder(newOrderData: any): Promise<Orders[] | string> {
    // desestructuramos los datos de la nueva orden
    const { userId, products } = newOrderData;

    //verificamos que el usuario exista
    const user = await this.ormUsersRepository.findOneBy({ id: userId });
    if (!user) {
      return `Usuario con ID ${userId} no encontrado`;
    }

    //creamos la orden
    const order = new Orders();
    order.date = new Date();
    order.user = user;
    const newOrder = await this.ormOrdersRepository.save(order);

    //asocio cada ID con el producto
    const productsArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.ormProductsRepository.findOneBy({
          id: element.id,
        });

        if (!product) {
          return `Producto con ID ${element.id} no encontrado`;
        }

        //actualizo stock
        await this.ormProductsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );
        return product;
      }),
    );

    //calculo el total
    const total = productsArray.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    //creo OrderDetail y la inserto en la DB
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;
    await this.ormOrderDetailRepository.save(orderDetail);

    //envio al cliente la compra con la informacion de la orden, el detalle y los productos
    return this.ormOrdersRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetails: true,
      },
    });
  }
}
