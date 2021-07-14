import { object, SchemaOf, string } from 'yup';

import { requiredErrorMessage } from '../../form/validation/messages';

export type CreateHdAccountModalFormValues = {
  name: string;
};

export const createHdAccountModalValidationSchema: SchemaOf<CreateHdAccountModalFormValues> = object().shape({
  name: string().required(requiredErrorMessage)
});
