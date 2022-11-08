import { boolean } from 'yup';

const seedPhraseBackupError = 'Unable to continue without made Seed Phrase backup';

export const madeSeedPhraseBackupValidation = boolean()
  .required(seedPhraseBackupError)
  .oneOf([true], seedPhraseBackupError);
