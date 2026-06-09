import { object, SchemaOf, string } from 'yup';

import { seedPhraseValidation } from 'src/form/validation/seed-phrase';

export type ImportAccountSeedValues = {
  seedPhrase: string;
  derivationPath?: string;
};

export const importAccountSeedInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  derivationPath: ''
};

const derivationPathValidation = string().test('validateDerivationPath', 'Invalid derivation path', path => {
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
});

export const importAccountSeedValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  derivationPath: derivationPathValidation
});
