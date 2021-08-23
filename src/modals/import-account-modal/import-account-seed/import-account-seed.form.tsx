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
  derivationPath: string().test('validateDerivationPath', 'Invalid derivation path', p => {
    if (p === undefined) {
      return true;
    }
    if (p.slice(-1) !== "'") {
      return false;
    }
    if (!p.startsWith('m')) {
      return false;
    }
    if (p.length > 1 && p[1] !== '/') {
      return false;
    }

    const parts = p.replace('m', '').split('/').filter(Boolean);

    if (parts.length < 4) {
      return false;
    }

    return parts.every((p: string) => {
      const pNum = +(p.includes("'") ? p.replace("'", '') : p);

      return Number.isSafeInteger(pNum) && pNum >= 0;
    });
  })
});
