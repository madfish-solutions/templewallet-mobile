import { boolean, object, SchemaOf, string } from 'yup';

import { FileInputValue } from '../../../components/file-input/file-input';
import { makeRequiredErrorMessage } from '../../../form/validation/messages';
import { seedPhraseValidation } from '../../../form/validation/seed-phrase';
import { isString } from '../../../utils/is-string';

export type ImportWalletFormValues = {
  seedPhrase: string;
};

export const importWalletValidationSchema: SchemaOf<ImportWalletFormValues> = object().shape({
  seedPhrase: seedPhraseValidation
});

export const importWalletInitialValues: ImportWalletFormValues = {
  seedPhrase: ''
};

export type ImportKukaiWalletFormValues = {
  keystoreFile: FileInputValue;
  password: string;
  shouldUseFilePasswordForExtension?: boolean;
};

export const importKukaiWalletValidationSchema: SchemaOf<ImportKukaiWalletFormValues> = object().shape({
  keystoreFile: object()
    .shape({})
    .test('keystore-file', 'A keystore file is required', value => isString(value.uri)) as SchemaOf<FileInputValue>,
  password: string().required(makeRequiredErrorMessage('File password')),
  shouldUseFilePasswordForExtension: boolean()
});

export const importKukaiWalletInitialValues: ImportKukaiWalletFormValues = {
  keystoreFile: {
    fileName: '',
    uri: ''
  },
  password: '',
  shouldUseFilePasswordForExtension: false
};
