import { mixed, object, SchemaOf, string } from 'yup';

import { ImportAccountDerivationEnum } from '../../../enums/account-type.enum';
import { seedPhraseValidation } from '../../../form/validation/seed-phrase';
import { getDerivationPath } from '../../../utils/keys.util';

export type ImportAccountSeedValues = {
  seedPhrase: string;
  password?: string;
  derivationType: ImportAccountDerivationEnum;
  derivationPath?: string;
};

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
  derivationPath: string()
});
