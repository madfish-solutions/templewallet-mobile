import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';

export type AddCustomRpcFormValues = {
  name: string;
  url: string;
};

export const addCustomRpcFormInitialValues: AddCustomRpcFormValues = {
  name: '',
  url: ''
};

export const addCustomRpcFormValidationSchema: SchemaOf<AddCustomRpcFormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name')),
  url: string().required(makeRequiredErrorMessage('URL'))
});
