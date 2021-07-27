import { validateMnemonic } from 'bip39';
import { string } from 'yup';

import { makeRequiredErrorMessage } from './messages';

const wordsCountError = '12, 15, 18, 21 or 24 words';
const validError = 'Invalid phrase';
const onlyAsciiRegex = new RegExp('^[\u0020-\u007e]*$');

export const seedPhraseValidation = string()
  .required(makeRequiredErrorMessage('Seed phrase'))
  .test('words-count', wordsCountError, value => {
    if (value) {
      const length = (value as string).split(' ').length;

      return [12, 15, 18, 21, 24].includes(length);
    }

    return false;
  })
  .test('is-mnemonic', validError, value => onlyAsciiRegex.test(value as string) && validateMnemonic(value as string));
