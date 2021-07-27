import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../../form/validation/accept-terms';
import { seedPhraseValidation } from '../../../form/validation/seed-phrase';

export type CreateNewWalletFormValues = {
  seedPhrase: string;
  madeSeedPhraseBackup: boolean;
};

export const createNewWalletValidationSchema: SchemaOf<CreateNewWalletFormValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  madeSeedPhraseBackup: acceptTermsValidation
});
