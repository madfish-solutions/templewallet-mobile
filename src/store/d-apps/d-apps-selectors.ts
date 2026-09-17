import { getSelectedAccountFromWallet } from 'src/utils/get-selected-account-from-wallet.util';

import { jsonEqualityFn } from '../../utils/store.utils';
import { useSelector } from '../selector';

import { isAccountConnection } from './connection.utils';

export const useSelectedAccountConnectionsSelector = () =>
  useSelector(({ dApps, wallet }) => {
    const account = getSelectedAccountFromWallet(wallet);

    return account ? dApps.connections.data.filter(connection => isAccountConnection(connection, account)) : [];
  }, jsonEqualityFn);

export const useDAppsListSelector = () => useSelector(({ dApps }) => dApps.dappsList.data, jsonEqualityFn);

export const useTokensApyRatesSelector = () => useSelector(({ dApps }) => dApps.tokensApyRates);
