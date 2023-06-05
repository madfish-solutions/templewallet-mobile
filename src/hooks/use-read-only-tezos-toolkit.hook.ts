import { useMemo } from 'react';

import { AccountInterface } from 'src/interfaces/account.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

export const useReadOnlyTezosToolkit = (sender?: AccountInterface) => {
  const defaultSender = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const senderWithDefault = sender ?? defaultSender;

  return useMemo(
    () => createReadOnlyTezosToolkit(selectedRpcUrl, senderWithDefault),
    [selectedRpcUrl, senderWithDefault]
  );
};
