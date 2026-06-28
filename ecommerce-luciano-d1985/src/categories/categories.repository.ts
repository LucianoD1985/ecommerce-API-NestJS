import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../categories/categories.entity';
import { allProducts } from '../utils/data';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private ormCategoriesRepository: Repository<Categories>,
  ) {}
  async getAllCategories(): Promise<Categories[]> {
    return await this.ormCategoriesRepository.find();
  }

  async addCategories(): Promise<string> {
    const insertPromises = allProducts.map((element) =>
      this.ormCategoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute(),
    );
    await Promise.all(insertPromises);
    return 'Categorías agregadas';
  }
}
