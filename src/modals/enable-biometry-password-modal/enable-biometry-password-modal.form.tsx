import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../utils/i18n.utils';

export type EnableBiometryPasswordModalFormValues = {
  password: string;
};

export const enableBiometryPasswordModalValidationSchema: SchemaOf<EnableBiometryPasswordModalFormValues> =
  object().shape({
    password: string().required(makeRequiredErrorMessage('Current password'))
  });

export const enableBiometryPasswordModalInitialValues: EnableBiometryPasswordModalFormValues = { password: '' };
