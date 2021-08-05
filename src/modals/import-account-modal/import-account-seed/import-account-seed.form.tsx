import { mixed, object, SchemaOf, string } from 'yup';

import { seedPhraseValidation } from '../../../form/validation/seed-phrase';
import { ImportAccountDerivationEnum, ImportAccountSeedValues } from '../../../interfaces/import-account-type';
import { getDerivationPath } from '../../../utils/keys.util';

export const importAccountSeedInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  password: '',
  derivationType: ImportAccountDerivationEnum.DEFAULT,
  derivationPath: getDerivationPath(0)
};

export const importAccountSeedValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  password: string(),
  derivationType: mixed<ImportAccountDerivationEnum>().oneOf(Object.values(ImportAccountDerivationEnum)).required(),
  derivationPath: string().required()
});
