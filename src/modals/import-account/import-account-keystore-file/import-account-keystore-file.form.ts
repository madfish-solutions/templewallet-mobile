import { object, SchemaOf, string } from 'yup';

import { FileInputValue } from 'src/components/file-input/file-input';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { isString } from 'src/utils/is-string';

export type ImportAccountKeystoreFileFormValues = {
  keystoreFile: FileInputValue;
  password: string;
};

export const importAccountKeystoreFileValidationSchema: SchemaOf<ImportAccountKeystoreFileFormValues> = object().shape({
  keystoreFile: object()
    .shape({})
    .test('keystore-file', 'A keystore file is required', value => isString(value?.uri))
    .required(),
  password: string().required(makeRequiredErrorMessage('File password'))
});

export const importAccountKeystoreFileInitialValues: ImportAccountKeystoreFileFormValues = {
  keystoreFile: {
    fileName: '',
    uri: ''
  },
  password: ''
};
