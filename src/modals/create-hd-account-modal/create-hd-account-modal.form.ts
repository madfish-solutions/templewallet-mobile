import { object, SchemaOf, string } from 'yup';

export type CreateHdAccountModalFormValues = {
  name: string;
};

export const createHdAccountModalValidationSchema: SchemaOf<CreateHdAccountModalFormValues> = object().shape({
  name: string().required()
});
