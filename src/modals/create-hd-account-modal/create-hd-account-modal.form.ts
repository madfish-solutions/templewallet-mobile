import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';

export type CreateHdAccountModalFormValues = {
  name: string;
};

export const createHdAccountModalValidationSchema: SchemaOf<CreateHdAccountModalFormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name'))
});
