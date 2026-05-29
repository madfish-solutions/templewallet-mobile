import { useMemo } from 'react';

import { Account } from 'src/interfaces/account.interfaces';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

import { getAccountForTezos } from '../utils/account.utils.ts';

const resolveReadOnlySigner = (sender: Account | TezosReadOnlySignerPayload | null | undefined) =>
  sender ? ('address' in sender ? sender : getAccountForTezos(sender)) : null;

export const useReadOnlyTezosToolkit = (sender?: Account | TezosReadOnlySignerPayload) => {
  const defaultSender = useRawCurrentAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolvedSender = sender ?? defaultSender;

  return useMemo(
    () => createReadOnlyTezosToolkit(selectedRpcUrl, resolveReadOnlySigner(resolvedSender)),
    [resolvedSender, selectedRpcUrl]
  );
};
