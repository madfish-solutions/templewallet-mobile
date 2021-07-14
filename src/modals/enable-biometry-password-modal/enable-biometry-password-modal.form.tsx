import { object, SchemaOf, string } from 'yup';

import { requiredErrorMessage } from '../../form/validation/messages';

export type EnableBiometryPasswordModalFormValues = {
  password: string;
};

export const enableBiometryPasswordModalValidationSchema: SchemaOf<EnableBiometryPasswordModalFormValues> =
  object().shape({
    password: string().required(requiredErrorMessage)
  });

export const enableBiometryPasswordModalInitialValues: EnableBiometryPasswordModalFormValues = { password: '' };
