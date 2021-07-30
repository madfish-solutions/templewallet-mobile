import { boolean, object, SchemaOf, string } from 'yup';

import { FileInputValue } from '../../../components/file-input/file-input';
import { seedPhraseValidation } from '../../../form/validation/seed-phrase';

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
  shouldUseFilePasswordForExtension: boolean;
};

export const importKukaiWalletValidationSchema: SchemaOf<ImportKukaiWalletFormValues> = object().shape({
  keystoreFile: object()
    .shape({
      fileName: string().required(),
      uri: string().required()
    })
    .required(),
  password: string().required(),
  shouldUseFilePasswordForExtension: boolean().required()
});

export const importKukaiWalletInitialValues: ImportKukaiWalletFormValues = {
  keystoreFile: {
    fileName: '',
    uri: ''
  },
  password: '',
  shouldUseFilePasswordForExtension: false
};
