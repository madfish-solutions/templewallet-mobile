import { Dispatch, SetStateAction, useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useCurrentAccountCollectibles, useCurrentAccountEvmCollectibles } from 'src/utils/assets/hooks';
import { DisplayedCollectible } from 'src/utils/assets/types';
import { isString } from 'src/utils/is-string';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

interface DisplayedCollectiblesState {
  collectibles: DisplayedCollectible[];
  searchValue: string | undefined;
  setSearchValue: Dispatch<SetStateAction<string | undefined>>;
}

export const useDisplayedCollectibles = (): DisplayedCollectiblesState => {
  const tezosCollectibles = useCurrentAccountCollectibles(true);
  const evmCollectibles = useCurrentAccountEvmCollectibles();
  const {
    setSearchValue,
    searchValue,
    filteredAssetsList: filteredTezosCollectibles
  } = useFilteredAssetsList(tezosCollectibles);

  const collectibles = useMemo<DisplayedCollectible[]>(() => {
    const searchValueLowercased = searchValue?.toLowerCase();
    const filteredEvmCollectibles = isString(searchValueLowercased)
      ? evmCollectibles.filter(({ metadata, tokenId }) =>
          isAssetSearched(
            {
              name: metadata?.collectibleName ?? metadata?.name ?? tokenId,
              symbol: metadata?.symbol ?? '',
              address: metadata?.address
            },
            searchValueLowercased
          )
        )
      : evmCollectibles;

    const tezosDisplayed: DisplayedCollectible[] = filteredTezosCollectibles.map(asset => ({
      chainKind: TempleChainKind.Tezos,
      slug: asset.slug,
      asset
    }));

    return tezosDisplayed.concat(filteredEvmCollectibles);
  }, [filteredTezosCollectibles, evmCollectibles, searchValue]);

  return { collectibles, searchValue, setSearchValue };
};
