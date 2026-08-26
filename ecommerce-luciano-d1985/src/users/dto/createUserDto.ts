import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from '../../decorators/matchPassword';

export class CreateUserDto {
  @ApiProperty({
    description: 'debe ser un string de entre 3 y 80 caracteress',
    example: 'Test User 01',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no debe exceder los 80 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Debe ser email válido',
    example: 'testuser01@example.com',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail(
    {},
    { message: 'El email debe ser una dirección de correo electrónico válida' },
  )
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo',
    },
  )
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(15, { message: 'La contraseña no debe exceder los 15 caracteres' })
  password!: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword!: string;

  @ApiProperty({
    description: 'Debe ser un número y no puede estar vacío',
    example: 1234567890,
  })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'El teléfono debe ser un número' },
  )
  phone!: number;

  @ApiProperty({
    description: 'Debe ser un string de entre 5 y 20 caracteres',
    example: 'Argentina',
  })
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(5, { message: 'El país debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'El país no debe exceder los 20 caracteres' })
  country?: string;

  @ApiProperty({
    description: 'Debe ser un string de entre 3 y 80 caracteres',
    example: 'example street 123',
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'La dirección no debe exceder los 80 caracteres' })
  address?: string;

  @ApiProperty({
    description: 'Debe ser un string de entre 5 y 20 caracteres',
    example: 'Buenos Aires',
  })
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MinLength(5, { message: 'La ciudad debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'La ciudad no debe exceder los 20 caracteres' })
  city?: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'Test User 01',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no debe exceder los 80 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Debe ser un número',
    example: 1234567890,
    required: false,
  })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El teléfono debe ser un número' },
  )
  phone?: number;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Argentina',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(5, { message: 'El país debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'El país no debe exceder los 20 caracteres' })
  country?: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'example street 123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'La dirección no debe exceder los 80 caracteres' })
  address?: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MinLength(5, { message: 'La ciudad debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'La ciudad no debe exceder los 20 caracteres' })
  city?: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;

  @ApiHideProperty()
  @IsEmpty()
  email?: string;

  @ApiHideProperty()
  @IsEmpty()
  password?: string;
}

export class LogginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
