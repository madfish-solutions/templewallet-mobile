import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../../form/validation/accept-terms';
import { seedPhraseValidation } from '../../../form/validation/seed-phrase';

export type BackupSeedFormValues = {
  seedPhrase: string;
  madeSeedPhraseBackup: boolean;
};

export const BackupSeedValidationSchema: SchemaOf<BackupSeedFormValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  madeSeedPhraseBackup: acceptTermsValidation
});
