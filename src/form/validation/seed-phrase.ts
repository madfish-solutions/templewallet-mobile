import { validateMnemonic } from 'bip39';
import { string } from 'yup';

import { requiredErrorMessage } from './messages';

const eachWordSeparatedError = 'Each word separated with a single space';
const wordsCountError = '12, 15, 18, 21 or 24 words';
const validError = 'Just valid pre-generated mnemonic in English';

export const seedPhraseValidation = string()
  .required(requiredErrorMessage)
  .test('each-word-separated', eachWordSeparatedError, value => {
    if (value) {
      return /^([a-zA-Z0-9]+\s?)*$/.test(value) && value[value.length - 1] !== ' ';
    }

    return false;
  })
  .test('words-count', wordsCountError, value => {
    if (value) {
      const length = (value as string).split(' ').length;

      return [12, 15, 18, 21, 24].includes(length);
    }

    return false;
  })
  .test('is-mnemonic', validError, value => validateMnemonic(value as string));
