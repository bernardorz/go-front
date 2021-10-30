import { ValidationError } from 'yup';

interface Errors{
 [key : string] : string;
}

export default function getValidationError(err : ValidationError): Errors {
  const validationErros : Errors = {};

  err.inner.forEach((error) => {
    validationErros[`${error.path}`] = error.message;
  });

  return validationErros;
}
