import { string } from 'yup';
import { validateMnemonic } from 'bip39';
import { requiredErrorMessage } from './shared';

const seedError =
  '12, 15, 18, 21 or 24 words in English\n' +
  'Each word separated with a single space\n' +
  'Just valid pre-generated mnemonic\n';

const seedPhraseValidation = string()
  .required(requiredErrorMessage)
  .test('is-mnemonic', seedError, value => !!value && validateMnemonic(value));

export default seedPhraseValidation;
