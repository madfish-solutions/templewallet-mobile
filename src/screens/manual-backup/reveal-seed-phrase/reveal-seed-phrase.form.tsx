import { object, SchemaOf } from 'yup';

import { madeSeedPhraseBackupValidation } from '../../../form/validation/made-seed-phrase-backup';

export type CreateNewWalletFormValues = {
  madeSeedPhraseBackup: boolean;
};

export const createNewWalletInitialValues: CreateNewWalletFormValues = {
  madeSeedPhraseBackup: false
};

export const createNewWalletValidationSchema: SchemaOf<CreateNewWalletFormValues> = object().shape({
  madeSeedPhraseBackup: madeSeedPhraseBackupValidation
});
