import { Jwt } from './../node_modules/@types/jsonwebtoken/index.d';
import { Type } from './../node_modules/typeorm/node_modules/path-scurry/dist/commonjs/index.d';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { JwtModule } from '@nestjs/jwt';
import { environment } from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    JwtModule.register({
      global: true,
      secret: environment.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
//export class AppModule {}
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  async onApplicationBootstrap() {
    await this.categoriesService.addCategories();
    console.log('Categorias cargadas'); //console.table??
    await this.productsService.addProducts();
    console.log('Productos cargados');
  }
}
