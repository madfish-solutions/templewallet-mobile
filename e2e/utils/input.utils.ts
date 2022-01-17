import { isString } from '../../src/utils/is-string';
import { getEnv } from './env.utils';

const appPassword = getEnv('E2E_APP_PASSWORD');
const seedPhrase = getEnv('E2E_SEED_PHRASE');

export const getInputText = (inputType: string, temporarySeedPhrase?: string) => {
  let inputText = '';

  switch (inputType) {
    case 'seed':
      inputText = isString(temporarySeedPhrase) ? temporarySeedPhrase : seedPhrase;
      break;
    case 'password':
      inputText = appPassword;
      break;
  }

  return inputText;
};
