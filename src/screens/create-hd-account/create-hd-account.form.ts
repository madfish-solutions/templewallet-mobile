import { object, SchemaOf, string } from 'yup';

export type CreateHdAccountFormValues = {
  name: string;
};

export const createHdAccountValidationSchema: SchemaOf<CreateHdAccountFormValues> = object().shape({
  name: string().required()
});
