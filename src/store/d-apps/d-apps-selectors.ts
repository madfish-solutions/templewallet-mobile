import { jsonEqualityFn } from '../../utils/store.utils';
import { useSelector } from '../selector';

export const useConnectionsSelector = () => useSelector(({ dApps }) => dApps.connections);

export const useDAppsListSelector = () => useSelector(({ dApps }) => dApps.dappsList.data, jsonEqualityFn);

export const useTokensApyRatesSelector = () => useSelector(({ dApps }) => dApps.tokensApyRates);
