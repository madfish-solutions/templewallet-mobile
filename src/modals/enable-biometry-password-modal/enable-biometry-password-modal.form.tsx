import { object, SchemaOf, string } from 'yup';

export type EnableBiometryPasswordModalFormValues = {
  password: string;
};

export const enableBiometryPasswordModalValidationSchema: SchemaOf<EnableBiometryPasswordModalFormValues> =
  object().shape({
    password: string().required()
  });

export const enableBiometryPasswordModalInitialValues: EnableBiometryPasswordModalFormValues = { password: '' };
