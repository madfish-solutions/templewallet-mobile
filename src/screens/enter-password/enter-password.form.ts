import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';

export type EnterPasswordFormValues = {
  password: string;
};

export const enterPasswordValidationSchema: SchemaOf<EnterPasswordFormValues> = object().shape({
  password: string().required(makeRequiredErrorMessage('Password'))
});

export const enterPasswordInitialValues: EnterPasswordFormValues = {
  password: ''
};
