import { useMemo } from 'react';

import { FIAT_CURRENCIES } from 'src/utils/exchange-rate.util';
import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../selector';

import { getFiatToUsdRate } from './utils';

export const useThemeSelector = () => useSelector(({ settings }) => settings.theme);

export const useBiometricsEnabledSelector = () => useSelector(({ settings }) => settings.isBiometricsEnabled);

export const useAnalyticsEnabledSelector = () => useSelector(({ settings }) => settings.isAnalyticsEnabled);

export const useBalanceHiddenSelector = () => useSelector(({ settings }) => settings.isBalanceHiddenSetting);

export const useRpcListSelector = () => useSelector(({ settings }) => settings.rpcList);
export const useSelectedRpcUrlSelector = () => useSelector(({ settings }) => settings.selectedRpcUrl);

export const useFiatCurrencySelector = () => useSelector(({ settings }) => settings.fiatCurrency);

export const useFiatToUsdRateSelector = () => useSelector(state => getFiatToUsdRate(state));

export const useCurrentFiatCurrencyMetadataSelector = () => {
  const fiatCurrency = useFiatCurrencySelector();
  const currentSymbol = useMemo(() => FIAT_CURRENCIES.find(x => x.name === fiatCurrency)?.symbol, [fiatCurrency]);

  return { name: fiatCurrency, symbol: currentSymbol };
};

export const useFirstAppLaunchSelector = () => useSelector(({ settings }) => settings.isFirstAppLaunch);

export const useUserIdSelector = () => useSelector(({ settings }) => settings.userId);

export const useSlippageSelector = () => useSelector(({ settings }) => settings.slippage);

export const useIsShownDomainNameSelector = () => useSelector(({ settings }) => settings.isShownDomainName);

export const useHideZeroBalancesSelector = () => useSelector(({ settings }) => settings.hideZeroBalances);

export const useIsShowLoaderSelector = () => useSelector(({ settings }) => settings.isShowLoader);

export const useIsApkBuildLaunchEventFiredSelector = () =>
  useSelector(({ settings }) => settings.isApkBuildLaunchEventFired);

export const useIsPushNotificationsEnabledEventFiredSelector = () =>
  useSelector(({ settings }) => settings.isPushNotificationsEnabledEventFired);

export const useIsBackupMadeSelector = () => {
  const isManualBackupMade = useSelector(({ settings }) => settings.isManualBackupMade);
  const isCloudBackupMade = useSelector(({ settings }) => settings.isCloudBackupMade);

  return useMemo(() => ({ isManualBackupMade, isCloudBackupMade }), [isManualBackupMade, isCloudBackupMade]);
};

export const useIsAnyBackupMadeSelector = () =>
  useSelector(({ settings }) => settings.isManualBackupMade || settings.isCloudBackupMade);

export const useOnRampOverlayStateSelector = () => useSelector(({ settings }) => settings.onRampOverlayState);

export const useIsInAppUpdateAvailableSelector = () => useSelector(({ settings }) => settings.isInAppUpdateAvailable);

export const useIsShowCollectibleInfoSelector = () => useSelector(({ settings }) => settings.isShowCollectibleInfo);

export const useAssetExchangeRate = (slug: string) => {
  const assetUsdExchangeRate = useSelector(state => state.currency.usdToTokenRates.data[slug]);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return isDefined(assetUsdExchangeRate) && isDefined(fiatToUsdRate) ? assetUsdExchangeRate * fiatToUsdRate : undefined;
};

export const useStartModalAllowedSelector = () => useSelector(({ settings }) => settings.startModalAllowed);
