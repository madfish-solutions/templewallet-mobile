import Clipboard from '@react-native-clipboard/clipboard';

import { showCopiedToast } from '../toast/toast.utils';

import { isString } from './is-string';

export const copyStringToClipboard = (content?: string) => {
  if (isString(content)) {
    Clipboard.setString(content);
    showCopiedToast();
  }
};
