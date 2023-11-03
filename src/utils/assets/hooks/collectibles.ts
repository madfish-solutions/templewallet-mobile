import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';

import { UsableAccountAsset } from '../types';

import { buildUsableAccountAsset } from './utils';

export const useCurrentAccountCollectibles = (enabledOnly = false) => {
  const accountCollectibles = useCurrentAccountStoredAssetsSelector('collectibles');
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountCollectibles.reduce<UsableAccountAsset[]>((acc, curr) => {
        const collectible = buildUsableAccountAsset(
          curr,
          allMetadatas[curr.slug]! // `accountCollectibles` r already filtered for metadata presence
        );

        if (enabledOnly) {
          return curr.visibility === VisibilityEnum.Visible && Number(curr.balance) > 0 ? acc.concat(collectible) : acc;
        }

        return acc.concat(collectible);
      }, []),
    [accountCollectibles, allMetadatas, enabledOnly]
  );
};

export const useCurrentAccountCollectiblesWithPositiveBalance = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemo(() => collectibles.filter(c => Number(c.balance) > 0), [collectibles]);
};
