import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../categories/categories.entity';
import { Products } from './products.entity';
import { allProducts } from '../utils/data';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private ormProductsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private ormCategoriesRepository: Repository<Categories>,
  ) {}

  async getAllProducts(page: number, limit: number): Promise<Products[]> {
    const skip = (page - 1) * limit;
    const products = await this.ormProductsRepository.find({
      relations: {
        category: true,
      },
      skip: skip,
      take: limit,
    });
    return products;
  }
  async addProducts(): Promise<string> {
    const categories = await this.ormCategoriesRepository.find();
    await Promise.all(
      allProducts.map(async (element) => {
        const category = categories.find(
          (category) => category.name === element.category,
        );
        if (!category)
          throw new Error(`Categoría no encontrada: ${element.category}`);
        const product = new Products();
        product.name = element.name;
        product.description = element.description;
        product.price = element.price;
        product.stock = element.stock;
        product.category = category;

        await this.ormProductsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .orUpdate(['description', 'price', 'stock'], ['name']) //'imageUrl' saque ese item porque no lo tengo en la entidad ni en el data.ts
          .execute();
      }),
    );
    return 'Productos agregados';
  }

  async getProductById(id: string): Promise<Products | string> {
    const product = await this.ormProductsRepository.findOneBy({ id });
    if (!product) {
      return 'Producto no encontrado';
    }
    return product;
  }

  async updateProduct(
    id: string,
    prodectNewData: Products,
  ): Promise<Products | null> {
    await this.ormProductsRepository.update(id, prodectNewData);
    const updatedProduct = await this.ormProductsRepository.findOneBy({ id });
    return updatedProduct;
  }
  async deleteProduct(id: string): Promise<string | null> {
    const product = await this.ormProductsRepository.findOneBy({ id });
    if (!product) return null;
    await this.ormProductsRepository.delete(id);
    return product.id;
  }
}
