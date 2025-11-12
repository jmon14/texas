import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Street } from '../../enums/street.enum';

export const IsRequiredIfPostFlop = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isRequiredIfPostFlop',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any, args: ValidationArguments) => {
          const street = (args.object as any).street;
          // If preflop, field is optional (validation passes)
          if (street === Street.PREFLOP) {
            return true;
          }
          // If post-flop, check if property exists in object
          const propName = args.property;
          const obj = args.object as any;
          // Check if property is explicitly set (even if undefined) or has a value
          const hasProperty = propName in obj;
          if (!hasProperty) {
            return false; // Property not provided, required for post-flop
          }
          // Property exists, check if it has a valid value
          return value !== undefined && value !== null && value !== '';
        },
        defaultMessage: (args: ValidationArguments) => {
          const street = (args.object as any).street;
          return `${args.property} is required for post-flop scenarios (street: ${street})`;
        },
      },
    });
  };
};
