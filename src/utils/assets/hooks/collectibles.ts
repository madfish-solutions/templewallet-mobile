import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';

import { UsableAccountAsset } from './utils';

export const useCurrentAccountCollectibles = (enabledOnly = false) => {
  const accountCollectibles = useCurrentAccountStoredAssetsSelector('collectibles');
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountCollectibles.reduce<UsableAccountAsset[]>((acc, { slug, balance, visibility }) => {
        const metadata = allMetadatas[slug]!; // `accountCollectibles` r already filtered for metadata presence

        if (visibility === VisibilityEnum.InitiallyHidden && Number(balance) > 0) {
          visibility = VisibilityEnum.Visible;
        }

        const asset: UsableAccountAsset = {
          slug,
          visibility,
          balance,
          ...metadata
        };

        if (enabledOnly) {
          return visibility === VisibilityEnum.Visible ? acc.concat(asset) : acc;
        }

        return acc.concat(asset);
      }, []),
    [accountCollectibles, allMetadatas, enabledOnly]
  );
};

export const useCurrentAccountCollectiblesWithPositiveBalance = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemo(() => collectibles.filter(c => Number(c.balance) > 0), [collectibles]);
};
