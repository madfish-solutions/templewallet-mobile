import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { urlValidation } from 'src/form/validation/url';

type AddCustomRpcFormValues = {
  name: string;
  url: string;
};

export const editCustomRpcFormValidationSchema: SchemaOf<AddCustomRpcFormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name')),
  url: urlValidation
});
