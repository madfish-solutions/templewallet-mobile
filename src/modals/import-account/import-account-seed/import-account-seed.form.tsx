import { isValidPath } from 'ed25519-hd-key';
import { mixed, object, SchemaOf, string } from 'yup';

import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { seedPhraseValidation } from 'src/form/validation/seed-phrase';
import { isDefined } from 'src/utils/is-defined';
import { getDerivationPath } from 'src/utils/keys.util';

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
  derivationPath: string().test('validateDerivationPath', 'Invalid derivation path', p =>
    isDefined(p) ? isValidPath(p) : true
  )
});
