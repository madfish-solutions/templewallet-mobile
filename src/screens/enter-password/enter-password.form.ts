import { object, SchemaOf, string } from 'yup';

export type EnterPasswordFormValues = {
  password: string;
};

export const enterPasswordValidationSchema: SchemaOf<EnterPasswordFormValues> = object().shape({
  password: string().required()
});

export const enterPasswordInitialValues: EnterPasswordFormValues = {
  password: ''
};
