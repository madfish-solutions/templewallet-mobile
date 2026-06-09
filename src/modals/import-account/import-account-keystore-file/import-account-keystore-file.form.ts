import { object, SchemaOf, string } from 'yup';

import { FileInputValue } from 'src/components/file-input/file-input';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { isString } from 'src/utils/is-string';

export type ImportAccountKeystoreFileFormValues = {
  keystoreFile: FileInputValue;
  password: string;
  derivationPath?: string;
};

const tezosDerivationPathValidation = string().test(
  'validateTezosDerivationPath',
  'Invalid Tezos derivation path',
  path => {
    const trimmedPath = path?.trim();

    if (!trimmedPath) {
      return true;
    }

    if (!trimmedPath.startsWith('m')) {
      return false;
    }

    if (trimmedPath.length > 1 && trimmedPath[1] !== '/') {
      return false;
    }

    return trimmedPath
      .replace('m', '')
      .split('/')
      .filter(Boolean)
      .every(pathPart => {
        const pathPartNumber = Number(pathPart.endsWith("'") ? pathPart.slice(0, -1) : pathPart);

        return Number.isSafeInteger(pathPartNumber) && pathPartNumber >= 0;
      });
  }
);

export const importAccountKeystoreFileValidationSchema: SchemaOf<ImportAccountKeystoreFileFormValues> = object().shape({
  keystoreFile: object()
    .shape({})
    .test('keystore-file', 'A keystore file is required', value => isString(value?.uri))
    .required(),
  password: string().required(makeRequiredErrorMessage('File password')),
  derivationPath: tezosDerivationPathValidation
});

export const importAccountKeystoreFileInitialValues: ImportAccountKeystoreFileFormValues = {
  keystoreFile: {
    fileName: '',
    uri: ''
  },
  password: '',
  derivationPath: ''
};
