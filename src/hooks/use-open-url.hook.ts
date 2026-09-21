import { useCallback } from 'react';

import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';
import { openUrl, useOpenUrlInAppBrowser } from 'src/utils/linking';

interface Options {
  rethrowError?: boolean;
}

export const useOpenUrl = ({ rethrowError = false }: Options = {}) => {
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();
  const openUrlInAppBrowser = useOpenUrlInAppBrowser();

  return useCallback(
    (url: string) => (isInAppBrowserEnabled ? openUrlInAppBrowser(url) : openUrl(url, { rethrowError })),
    [isInAppBrowserEnabled, openUrlInAppBrowser, rethrowError]
  );
};
