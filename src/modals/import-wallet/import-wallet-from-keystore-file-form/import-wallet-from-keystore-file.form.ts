import { boolean, object, SchemaOf, string } from 'yup';

import { FileInputValue } from 'src/components/file-input/file-input';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { isString } from 'src/utils/is-string';

export type ImportWalletFromKeystoreFileFormValues = {
  keystoreFile: FileInputValue;
  password: string;
  shouldUseFilePasswordForExtension: boolean;
};

export const importWalletFromKeystoreFileValidationSchema: SchemaOf<ImportWalletFromKeystoreFileFormValues> =
  object().shape({
    keystoreFile: object()
      .shape({})
      .test('keystore-file', 'A keystore file is required', value => isString(value?.uri))
      .required(),
    password: string().required(makeRequiredErrorMessage('File password')),
    shouldUseFilePasswordForExtension: boolean().required()
  });

export const importWalletFromKeystoreFileInitialValues: ImportWalletFromKeystoreFileFormValues = {
  keystoreFile: {
    fileName: '',
    uri: ''
  },
  password: '',
  shouldUseFilePasswordForExtension: false
};
