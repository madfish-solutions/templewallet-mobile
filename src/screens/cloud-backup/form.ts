import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';

export type EnterCloudPasswordFormValues = {
  password: string;
};

export const EnterCloudPasswordValidationSchema: SchemaOf<EnterCloudPasswordFormValues> = object().shape({
  password: passwordValidation
});

export const EnterCloudPasswordInitialValues: EnterCloudPasswordFormValues = {
  password: ''
};
