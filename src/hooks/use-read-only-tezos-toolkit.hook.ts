import { useMemo } from 'react';

import { Account } from 'src/interfaces/account.interfaces';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

export const useReadOnlyTezosToolkit = (sender?: Account) => {
  const defaultSender = useRawCurrentAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolvedSender = sender ?? defaultSender;

  return useMemo(() => createReadOnlyTezosToolkit(selectedRpcUrl, resolvedSender), [resolvedSender, selectedRpcUrl]);
};
