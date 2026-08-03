import { useMemo } from 'react';

import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { SendAsset } from './send-asset.types';
import { sortSendAssets } from './send-assets.utils';
import { useEvmSendAssets } from './use-evm-send-assets.hook';
import { useTezosSendAssets } from './use-tezos-send-assets.hook';

export const useSendAssets = (): SendAsset[] => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const tezosAssets = useTezosSendAssets(tezosToken);
  // EVM assets still satisfy the legacy TokenInterface shape and therefore share its visibility flag.
  const evmAssets = useEvmSendAssets(tezosToken.visibility);

  return useMemo(() => sortSendAssets(tezosAssets.concat(evmAssets)), [evmAssets, tezosAssets]);
};
