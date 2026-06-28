import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
//@ValidatorConstraint({
// name: 'MatchPassword',
// async: false,
// })
//export class MatchPassword implements ValidatorConstraintInterface {
//validate(
//matchPassword: string,
//args: ValidationArguments,
//): promise<boolean> | boolean {
//console.log('matchPassword', matchPassword);
//console.log('args', args);
//return true;
//}
//}
export class MatchPassword implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    //validate(matchPassword: string, validationArguments?: ValidationArguments) Promise<boolean> | boolean{
    //console.log(args);
    const obj = args.object as Record<string, unknown>;
    const key = args.constraints[0]; //password
    const password = obj[key];
    if (confirmPassword !== password) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Password y ConfirmPassword no coinciden';
  }
}
