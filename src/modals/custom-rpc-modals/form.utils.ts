import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { urlValidation } from 'src/form/validation/url';

interface FormValues {
  name: string;
  url: string;
}

export const addCustomRpcFormInitialValues: FormValues = {
  name: '',
  url: ''
};

export const formValidationSchema: SchemaOf<FormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name')),
  url: urlValidation
});
