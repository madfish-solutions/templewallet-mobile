import { ChainIds } from '@taquito/taquito';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';

import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { READ_ONLY_SIGNER_PUBLIC_KEY, READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from 'src/utils/env.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';

export const useChainId = () => {
  const [chainId, setChainId] = useState<string>(ChainIds.MAINNET);
  const rpcUrl = useSelectedRpcUrlSelector();

  useEffect(() => {
    const tezos = createReadOnlyTezosToolkit(rpcUrl, {
      publicKey: READ_ONLY_SIGNER_PUBLIC_KEY,
      publicKeyHash: READ_ONLY_SIGNER_PUBLIC_KEY_HASH
    });
    tezos.rpc.getChainId().then(setChainId).catch(noop);
  }, [rpcUrl]);

  return chainId;
};
