import { useMemo } from 'react';

import { FIAT_CURRENCIES } from 'src/utils/exchange-rate.util';

import { useSelector } from '../selector';

export const useThemeSelector = () => useSelector(({ settings }) => settings.theme);

export const useBiometricsEnabledSelector = () => useSelector(({ settings }) => settings.isBiometricsEnabled);

export const useAnalyticsEnabledSelector = () => useSelector(({ settings }) => settings.isAnalyticsEnabled);

export const useBalanceHiddenSelector = () => useSelector(({ settings }) => settings.isBalanceHiddenSetting);

export const useRpcListSelector = () => useSelector(({ settings }) => settings.rpcList);
export const useSelectedRpcUrlSelector = () => useSelector(({ settings }) => settings.selectedRpcUrl);

export const useFiatCurrencySelector = () => useSelector(({ settings }) => settings.fiatCurrency);

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

export const useIsManualBackupMadeSelector = () => useSelector(({ settings }) => settings.isManualBackupMade);
