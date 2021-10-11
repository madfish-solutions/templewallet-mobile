import { useMemo } from 'react';

import { AccountInterface } from '../interfaces/account.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { createReadOnlyTezosToolkit } from '../utils/rpc/tezos-toolkit.utils';

export const useReadOnlyTezosToolkit = (sender: AccountInterface) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return useMemo(() => createReadOnlyTezosToolkit(selectedRpcUrl, sender), [selectedRpcUrl, sender]);
};
