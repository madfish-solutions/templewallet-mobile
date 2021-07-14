import { object, SchemaOf, string } from 'yup';

import { requiredErrorMessage } from '../../form/validation/messages';

export type EnterPasswordFormValues = {
  password: string;
};

export const enterPasswordValidationSchema: SchemaOf<EnterPasswordFormValues> = object().shape({
  password: string().required(requiredErrorMessage)
});

export const enterPasswordInitialValues: EnterPasswordFormValues = {
  password: ''
};
