import { object, boolean, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';

export type RestoreFromCloudFormValues = {
  password: string;
  reusePassword: boolean;
};

export const RestoreFromCloudValidationSchema: SchemaOf<RestoreFromCloudFormValues> = object().shape({
  password: passwordValidation,
  reusePassword: boolean().required()
});

export const RestoreFromCloudInitialValues: RestoreFromCloudFormValues = {
  password: '',
  reusePassword: true
};
