import { object, SchemaOf } from 'yup';

import { passwordConfirmationValidation, passwordValidation } from '../../../../form/validation/password';

export type CreateNewPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export const createNewPasswordValidationSchema: SchemaOf<CreateNewPasswordFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation
});

export const createNewPasswordInitialValues: CreateNewPasswordFormValues = {
  password: '',
  passwordConfirmation: ''
};
