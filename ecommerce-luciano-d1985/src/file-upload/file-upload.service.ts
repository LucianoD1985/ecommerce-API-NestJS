import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}
  async uploadImage(file: Express.Multer.File, productId: string) {
    //verificar que exista
    const product = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (!product)
      throw new NotFoundException(
        `Producto con id: ${productId} no encontrado`,
      );
    //cargar imagen
    const response = await this.fileUploadRepository.uploadImage(file);

    //modificar URL
    await this.productsRepository.update(productId, {
      imageUrl: response.secure_url,
    });
    //retornar el producto modificado
    const updatedProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    return updatedProduct;
  }
}
