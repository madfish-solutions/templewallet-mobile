import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { SendAsset } from 'src/types/send-asset';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { sortSendAssets } from './send-assets.utils';
import { useEvmSendAssets } from './use-evm-send-assets.hook';
import { useTezosSendAssets } from './use-tezos-send-assets.hook';

export const useSendAssets = (): SendAsset[] => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const tezosAssets = useTezosSendAssets(tezosToken);
  const evmAssets = useEvmSendAssets(ETHERLINK_MAINNET_CHAIN_ID, CryptoLogoNameEnum.Tezos);

  return useMemo(() => sortSendAssets([...tezosAssets, ...evmAssets]), [evmAssets, tezosAssets]);
};
