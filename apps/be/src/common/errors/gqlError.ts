// import { unwrapResolverError } from '@apollo/server/errors';
import type { ValidationError as ClassValidatorValidationError } from 'class-validator';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
// import { ArgumentValidationError } from 'type-graphql';

export function formatError(
  formattedError: GraphQLFormattedError,
): GraphQLFormattedError {
  // const originalError = unwrapResolverError(error);
  const errorCode = formattedError.extensions.code;

  if (errorCode) {
    return {
      message: formattedError.message,
      // @ts-ignore
      code: errorCode,
    };
  }

  // Log
  // console.log(
  //   `Server error: ${
  //     originalError instanceof Error ? originalError.message : originalError
  //   }`,
  // );

  // // Validation
  // if (originalError instanceof ArgumentValidationError) {
  //   return new ValidationError(originalError.validationErrors);
  // }

  // Generic
  return formattedError;
}

type IValidationError = Pick<
  ClassValidatorValidationError,
  'property' | 'value' | 'constraints' | 'children'
>;

function formatValidationErrors(
  validationError: IValidationError,
): IValidationError {
  return {
    property: validationError.property,
    ...(validationError.value && { value: validationError.value }),
    ...(validationError.constraints && {
      constraints: validationError.constraints,
    }),
    ...(validationError.children &&
      validationError.children.length !== 0 && {
        children: validationError.children.map((child) =>
          formatValidationErrors(child),
        ),
      }),
  };
}

export class ValidationError extends GraphQLError {
  public constructor(validationErrors: ClassValidatorValidationError[]) {
    super('Validation Error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        validationErrors: validationErrors.map((validationError) =>
          formatValidationErrors(validationError),
        ),
      },
    });

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
