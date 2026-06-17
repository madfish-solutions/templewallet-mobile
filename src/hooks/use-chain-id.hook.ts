import { ChainIds } from '@taquito/taquito';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';

import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { tezosReadOnlySignerAccount } from 'src/utils/tezos-read-only.signer.util.ts';

/** @deprecated // Flawed logic. Manifests in a wrong initial value */
export const useChainId = () => {
  const [chainId, setChainId] = useState<string>(ChainIds.MAINNET);
  const rpcUrl = useSelectedRpcUrlSelector();

  useEffect(() => {
    const tezos = createReadOnlyTezosToolkit(rpcUrl, tezosReadOnlySignerAccount);
    tezos.rpc.getChainId().then(setChainId).catch(noop);
  }, [rpcUrl]);

  return chainId;
};
