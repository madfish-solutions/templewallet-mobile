import { boolean } from 'yup';

const defaultSeedPhraseBackupError = 'Unable to continue without made Seed Phrase backup';

export const madeSeedPhraseBackupValidationFactory = (errorText = defaultSeedPhraseBackupError) =>
  boolean().required(errorText).oneOf([true], errorText);
