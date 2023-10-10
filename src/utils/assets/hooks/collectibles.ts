import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

export const useAccountCollectibles = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemoWithCompare(
    () =>
      collectibles.stored.reduce<AccountTokenInterface[]>((acc, curr) => {
        if (collectibles.removed.indexOf(curr.slug) > -1) {
          return acc;
        }

        const visibility =
          curr.visibility === VisibilityEnum.InitiallyHidden && Number(curr.balance) > 0
            ? VisibilityEnum.Visible
            : curr.visibility;

        return acc.concat({
          ...curr,
          visibility
        });
      }, []) ?? [],
    [collectibles],
    isEqual
  );
};

export interface UsableAccountAsset extends TokenMetadataInterface {
  slug: string;
  balance: string;
}

export const useEnabledAccountCollectibles = () => {
  const accountCollectibles = useAccountCollectibles();
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountCollectibles.reduce<UsableAccountAsset[]>((acc, { slug, balance, visibility }) => {
        const metadata = allMetadatas[slug]!; // `accountCollectibles` r already filtered for metadata presence

        return visibility === VisibilityEnum.Visible
          ? acc.concat({
              slug,
              balance,
              ...metadata
            })
          : acc;
      }, []),
    [accountCollectibles, allMetadatas]
  );
};
