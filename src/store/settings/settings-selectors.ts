import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RpcInterface } from '../../interfaces/rpc.interface';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { FIAT_CURRENCIES, FiatCurrenciesEnum } from '../../utils/exchange-rate.util';
import { getFiatToUsdRate } from '../../utils/token-metadata.utils';
import { RootState } from '../create-store';
import { SettingsRootState, SettingsState } from './settings-state';

export const useThemeSelector = () => useSelector<SettingsRootState, ThemesEnum>(({ settings }) => settings.theme);

export const useBiometricsEnabledSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBiometricsEnabled);

export const useAnalyticsEnabledSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isAnalyticsEnabled);

export const useBalanceHiddenSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBalanceHiddenSetting);

export const useRpcListSelector = () =>
  useSelector<SettingsRootState, RpcInterface[]>(({ settings }) => settings.rpcList);
export const useSelectedRpcUrlSelector = () =>
  useSelector<SettingsRootState, string>(({ settings }) => settings.selectedRpcUrl);

export const useFiatCurrencySelector = () =>
  useSelector<SettingsRootState, FiatCurrenciesEnum>(({ settings }) => settings.fiatCurrency);

export const useFiatToUsdRateSelector = () =>
  useSelector<RootState, number | undefined>(state => getFiatToUsdRate(state));

export const useCurrentFiatCurrencyMetadataSelector = () => {
  const fiatCurrency = useFiatCurrencySelector();
  const currentSymbol = useMemo(() => FIAT_CURRENCIES.find(x => x.name === fiatCurrency)?.symbol, [fiatCurrency]);

  return { name: fiatCurrency, symbol: currentSymbol };
};

export const useFirstAppLaunchSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isFirstAppLaunch);

export const useUserIdSelector = () => useSelector<SettingsRootState, string>(({ settings }) => settings.userId);

export const useSlippageSelector = () => useSelector<SettingsRootState, number>(({ settings }) => settings.slippage);

export const useIsShownDomainName = () =>
  useSelector<SettingsRootState, SettingsState['isShownDomainName']>(({ settings }) => settings.isShownDomainName);

export const useHideZeroBalances = () =>
  useSelector<SettingsRootState, SettingsState['hideZeroBalances']>(({ settings }) => settings.hideZeroBalances);
