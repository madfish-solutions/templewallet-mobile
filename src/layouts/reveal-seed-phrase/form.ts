import { object, SchemaOf } from 'yup';

import { madeSeedPhraseBackupValidationFactory } from 'src/form/validation/made-seed-phrase-backup';

export type CreateNewWalletFormValues = {
  madeSeedPhraseBackup: boolean;
};

export const createNewWalletInitialValues: CreateNewWalletFormValues = {
  madeSeedPhraseBackup: false
};

export const createNewWalletValidationSchemaFactory = (errorText?: string): SchemaOf<CreateNewWalletFormValues> =>
  object().shape({
    madeSeedPhraseBackup: madeSeedPhraseBackupValidationFactory(errorText)
  });
