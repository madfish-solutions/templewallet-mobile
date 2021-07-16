import { validateMnemonic } from 'bip39';
import { string } from 'yup';

const wordsCountError = '12, 15, 18, 21 or 24 words';
const validError = 'Invalid phrase';

export const seedPhraseValidation = string()
  .required()
  .test('words-count', wordsCountError, value => {
    if (value) {
      const length = (value as string).split(' ').length;

      return [12, 15, 18, 21, 24].includes(length);
    }

    return false;
  })
  .test('is-mnemonic', validError, value => validateMnemonic(value as string));
