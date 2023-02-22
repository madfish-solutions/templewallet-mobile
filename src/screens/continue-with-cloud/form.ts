import { object, boolean, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';

export type ContinueWithCloudFormValues = {
  password: string;
  reusePassword: boolean;
};

export const ContinueWithCloudValidationSchema: SchemaOf<ContinueWithCloudFormValues> = object().shape({
  password: passwordValidation,
  reusePassword: boolean().required()
});

export const ContinueWithCloudInitialValues: ContinueWithCloudFormValues = {
  password: '',
  reusePassword: true
};
