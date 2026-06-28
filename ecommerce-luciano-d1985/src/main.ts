import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  const PORT = environment.PORT;
  const HOST = environment.HOST;

  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
}
bootstrap();

//import { NestFactory } from '@nestjs/core';
//import { AppModule } from './app.module';

//async function bootstrap() {
// const app = await NestFactory.create(AppModule);

//await app.listen(process.env.PORT ?? 3000);
//console.log('Servidor escuchando en el puerto 3000');
//}
//bootstrap();
