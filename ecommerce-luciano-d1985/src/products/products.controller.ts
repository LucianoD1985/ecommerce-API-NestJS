import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProductDto } from './updateProductDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(@Query('page') page: string, @Query('limit') limit: string) {
    if (page && limit)
      return this.productsService.getAllProducts(Number(page), Number(limit));
    return this.productsService.getAllProducts(Number(1), Number(5));
  }

  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() productNewData: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, productNewData);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
