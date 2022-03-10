import { isAndroid } from '../config/system';

const autocorrectDisableAndroid = {
  autoCorrect: false,
  spellCheck: false,
  autoComplete: 'off',
  keyboardType: 'visible-password'
};

const autocorrectDisableIos = {
  autoCorrect: false,
  spellCheck: false
};

export const autocorrectDisableProps = isAndroid ? autocorrectDisableAndroid : autocorrectDisableIos;
