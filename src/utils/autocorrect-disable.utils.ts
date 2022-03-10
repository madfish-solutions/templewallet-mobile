import { isAndroid } from '../config/system';

export const autocorrectDisable = {
  autoCorrect: false,
  autoComplete: 'off',
  spellCheck: isAndroid ? false : undefined,
  keyboardType: isAndroid ? 'visible-password' : undefined
};
