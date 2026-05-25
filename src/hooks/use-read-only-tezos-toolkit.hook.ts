import { useMemo } from 'react';

import { AccountInterface } from 'src/interfaces/account.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

export const useReadOnlyTezosToolkit = (sender?: AccountInterface) => {
  const defaultSender = useRawCurrentAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  let publicKeyHash = '';
  let publicKey = '';

  if (sender) {
    publicKeyHash = getAccountAddressForTezos(sender) ?? '';
    publicKey = sender.publicKey;
  } else if (defaultSender) {
    publicKeyHash = getAccountAddressForTezos(defaultSender) ?? '';
    publicKey = defaultSender.publicKey;
  }

  return useMemo(
    () => createReadOnlyTezosToolkit(selectedRpcUrl, publicKeyHash ? { publicKey, publicKeyHash } : undefined),
    [selectedRpcUrl, publicKey, publicKeyHash]
  );
};
