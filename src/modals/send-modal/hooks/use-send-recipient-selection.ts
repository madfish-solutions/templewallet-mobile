import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useFilteredReceiversList } from 'src/hooks/use-filtered-receivers-list.hook';
import { TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { SendAsset } from 'src/types/send-asset';

interface Params {
  asset: SendAsset;
  evmAddress?: string;
  saplingAddress?: string;
  tezosAddress?: string;
}

export const useSendRecipientSelection = ({ asset, evmAddress, saplingAddress, tezosAddress }: Params) => {
  const isShieldedSend = asset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const sourceAddress = isShieldedSend
    ? saplingAddress
    : asset.chainKind === TempleChainKind.Tezos
    ? tezosAddress
    : evmAddress;
  const { receiversList, filteredReceiversList, handleSearchValueChange } = useFilteredReceiversList(
    asset.chainKind,
    sourceAddress,
    isShieldedSend
  );
  const firstReceiver = useMemo(() => receiversList.flatMap(({ data }) => data)[0], [receiversList]);

  return {
    filteredReceiversList,
    firstReceiver,
    handleSearchValueChange,
    isShieldedSend,
    isTransferDisabled: receiversList.length === 0,
    receiversList
  };
};
