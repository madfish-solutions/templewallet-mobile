import { useMemo } from 'react';

import { useAccount } from 'src/store/wallet/wallet-selectors';
import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';
import { getAccountForTezos } from 'src/utils/account.utils.ts';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

export const useReadOnlyTezosToolkit = (sender?: TezosReadOnlySignerPayload) => {
  const account = useAccount();

  return useMemo(() => createReadOnlyTezosToolkit(sender ?? getAccountForTezos(account)), [account, sender]);
};
