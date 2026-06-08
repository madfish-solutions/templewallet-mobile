import { object, SchemaOf, string } from 'yup';

import { seedPhraseValidation } from 'src/form/validation/seed-phrase';
import { getEvmDerivationPath } from 'src/utils/keys.utils';

export type ImportAccountSeedValues = {
  seedPhrase: string;
  derivationPath?: string;
};

export const importAccountSeedInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  derivationPath: ''
};

export const importAccountSeedDerivationPathPlaceholder = getEvmDerivationPath(0);

const derivationPathValidation = string().test('validateDerivationPath', 'Invalid derivation path', path => {
  if (!path) {
    return true;
  }

  if (!path.startsWith('m')) {
    return false;
  }

  if (path.length > 1 && path[1] !== '/') {
    return false;
  }

  return path
    .replace('m', '')
    .split('/')
    .filter(Boolean)
    .every(pathPart => {
      const pathPartNumber = Number(pathPart.endsWith("'") ? pathPart.slice(0, -1) : pathPart);

      return Number.isSafeInteger(pathPartNumber) && pathPartNumber >= 0;
    });
});

export const importAccountSeedValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  derivationPath: derivationPathValidation
});
