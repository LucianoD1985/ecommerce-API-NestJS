# 🛒 Ecommerce API — NestJS

API REST para un e-commerce, desarrollada con **NestJS**, **TypeORM** y **PostgreSQL** durante el bootcamp Full Stack de Henry.

## ✨ Funcionalidades

- 🔐 Registro y login con **JWT** y contraseñas hasheadas con **bcrypt**
- 👥 Roles de usuario (admin / usuario) con guards
- 📦 CRUD de productos y categorías
- 🧾 Creación y consulta de órdenes
- 🖼️ Carga de imágenes de productos en **Cloudinary**
- ✅ Validación de datos con `class-validator` y DTOs
- 🗃️ Migraciones con TypeORM
- 📚 Documentación interactiva con **Swagger**

## 🛠️ Tecnologías

![stack](https://skillicons.dev/icons?i=nestjs,ts,postgres,nodejs)

NestJS · TypeScript · TypeORM · PostgreSQL · JWT · bcrypt · Cloudinary · Swagger · Jest

## 🚀 Instalación

```bash
git clone https://github.com/LucianoD1985/Ecommerce-API-NestJS.git
cd Ecommerce-API-NestJS/ecommerce-luciano-d1985
npm install
```

Creá un archivo `.env` en esa carpeta:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=ecommerce
JWT_SECRET=tu_secreto
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Ejecutá las migraciones y levantá el servidor:

```bash
npm run migration:run
npm run start:dev
```

## 📚 Documentación

Con el servidor corriendo: **http://localhost:3000/api**

## 👨‍💻 Autor

**Luciano Marañón** — Backend Developer
[LinkedIn](https://www.linkedin.com/in/luciano-mara%C3%B1on-528482a5) · [GitHub](https://github.com/LucianoD1985)
