import { useMemo } from 'react';

import { FIAT_CURRENCIES } from 'src/utils/exchange-rate.util';
import { getFiatToUsdRate } from 'src/utils/token-metadata.utils';

import { useSelector } from '../selector';

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

export const useIsBackupMadeSelector = () => {
  const isManualBackupMade = useSelector(({ settings }) => settings.isManualBackupMade);
  const isCloudBackupMade = useSelector(({ settings }) => settings.isCloudBackupMade);

  return useMemo(() => ({ isManualBackupMade, isCloudBackupMade }), [isManualBackupMade, isCloudBackupMade]);
};

export const useIsAnyBackupMadeSelector = () =>
  useSelector(({ settings }) => settings.isManualBackupMade || settings.isCloudBackupMade);

export const useIsOnRampPossibilitySelector = () => useSelector(({ settings }) => settings.isOnRampPossibility);
