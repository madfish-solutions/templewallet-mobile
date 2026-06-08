import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';

export interface ImportAccountPrivateKeyValues {
  privateKey: string;
}

export const importAccountPrivateKeyValidationSchema: SchemaOf<ImportAccountPrivateKeyValues> = object().shape({
  privateKey: string().required(makeRequiredErrorMessage('Private key'))
});

export const importAccountPrivateKeyInitialValues: ImportAccountPrivateKeyValues = {
  privateKey: ''
};
