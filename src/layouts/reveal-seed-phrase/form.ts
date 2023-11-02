import { object, SchemaOf } from 'yup';

import { madeSeedPhraseBackupValidation } from 'src/form/validation/made-seed-phrase-backup';

export type CreateNewWalletFormValues = {
  madeSeedPhraseBackup: boolean;
};

export const createNewWalletInitialValues: CreateNewWalletFormValues = {
  madeSeedPhraseBackup: false
};

export const createNewWalletValidationSchema = (errorText?: string): SchemaOf<CreateNewWalletFormValues> =>
  object().shape({
    madeSeedPhraseBackup: madeSeedPhraseBackupValidation(errorText)
  });
