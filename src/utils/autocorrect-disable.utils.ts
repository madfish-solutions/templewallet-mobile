import { isAndroid } from '../config/system';

export const autocorrectDisable = {
  autoCorrect: false,
  autoComplete: isAndroid ? 'off' : undefined,
  spellCheck: false,
  keyboardType: isAndroid ? 'visible-password' : undefined
};
