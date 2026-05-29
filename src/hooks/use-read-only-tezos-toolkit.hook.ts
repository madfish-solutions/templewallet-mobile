import { useMemo } from 'react';

import { Account } from 'src/interfaces/account.interfaces';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { getAccountForTezos } from '../utils/account.utils.ts';

export const useReadOnlyTezosToolkit = (sender?: Account) => {
  const defaultSender = useRawCurrentAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolvedSender = sender ?? defaultSender;

  return useMemo(
    () => createReadOnlyTezosToolkit(selectedRpcUrl, getAccountForTezos(resolvedSender)),
    [resolvedSender, selectedRpcUrl]
  );
};
