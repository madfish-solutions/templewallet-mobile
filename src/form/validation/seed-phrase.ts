import { string } from 'yup';
import { validateMnemonic } from 'bip39';
import { requiredErrorMessage } from './shared';

const eachWordSeparatedError = 'Each word separated with a single space';
const wordsCountError = '12, 15, 18, 21 or 24 words';
const validError = 'Just valid pre-generated mnemonic in English';

const seedPhraseValidation = string()
  .required(requiredErrorMessage)
  .test('each-word-separated', eachWordSeparatedError, value => {
    if (value) {
      return /^([a-zA-Z0-9]+\s?)*$/.test(value) && value[value.length - 1] !== ' ';
    }
    return false;
  })
  .test('words-count', wordsCountError, value => {
    const length = (value as string).split(' ').length;
    return length % 3 === 0;
  })
  .test('is-mnemonic', validError, value => validateMnemonic(value as string));

export default seedPhraseValidation;
