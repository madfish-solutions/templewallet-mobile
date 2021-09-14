import { isAndroid, isIOS } from '../config/system';

export const normalizeFileUri = (uri: string) => {
  if (isIOS || isAndroid) {
    const filePrefix = 'file://';

    if (uri.startsWith(filePrefix)) {
      uri = uri.substring(filePrefix.length);
      try {
        uri = decodeURI(uri);
      } catch {}
    }
  }

  return uri;
};
