import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';

export type RenameAccountModalFormValues = {
  name: string;
};

export const renameAccountModalValidationSchema: SchemaOf<RenameAccountModalFormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name'))
});
