import { PickType } from '@nestjs/swagger';
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
  // ValidatorConstraint,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword';
//import { Orders } from 'src/orders/orders.entity';

export class CreateUserDto {
  //id: string;
  //orders: Orders[]; //es una propiedad de nuestro usuario pero como el id no lo va a mandar el usuario

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no debe exceder los 80 caracteres' })
  name!: string;
  //name:string;
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail(
    {},
    { message: 'El email debe ser una dirección de correo electrónico válida' },
  )
  email!: string;

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

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword!: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'El teléfono debe ser un número' },
  )
  phone!: number;

  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(5, { message: 'El país debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'El país no debe exceder los 20 caracteres' })
  country!: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'La dirección no debe exceder los 80 caracteres' })
  address!: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MinLength(5, { message: 'La ciudad debe tener al menos 5 caracteres' })
  @MaxLength(20, { message: 'La ciudad no debe exceder los 20 caracteres' })
  city!: string;

  @IsEmpty()
  isAdmin!: boolean;
}

//MINUTO 48 FALTA COMPLETAR CON LOS OTROS DATOS FIJARSE
export class UpdateUserDto {
  @IsEmpty()
  email!: string;

  @IsOptional()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: 'El teléfono debe ser un número' },
  )
  phone?: number;
}
export class LogginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
