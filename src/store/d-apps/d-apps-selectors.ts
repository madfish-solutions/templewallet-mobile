import { jsonEqualityFn } from '../../utils/store.utils';
import { useSelector } from '../selector';

export const usePermissionsSelector = () => useSelector(({ dApps }) => dApps.permissions);

export const useDAppsListSelector = () => useSelector(({ dApps }) => dApps.dappsList.data, jsonEqualityFn);

export const useTokensApyRatesSelector = () => useSelector(({ dApps }) => dApps.tokensApyRates);
