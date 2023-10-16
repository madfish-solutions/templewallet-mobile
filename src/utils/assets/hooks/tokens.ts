import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';

import { UsableAccountAsset } from './utils';

export const useAccountTokens = () => {
  const tokens = useCurrentAccountStoredAssetsSelector('tokens');

  return useMemoWithCompare(
    () =>
      tokens.map<AccountTokenInterface>(asset => {
        const visibility =
          asset.visibility === VisibilityEnum.InitiallyHidden && Number(asset.balance) > 0
            ? VisibilityEnum.Visible
            : asset.visibility;

        return {
          ...asset,
          visibility
        };
      }),
    [tokens],
    isEqual
  );
};

export const useAvailableAccountTokens = (enabledOnly = false) => {
  const accountTokens = useAccountTokens();
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountTokens.reduce<UsableAccountAsset[]>((acc, { slug, balance, visibility }) => {
        const metadata = allMetadatas[slug]!; // `accountCollectibles` r already filtered for metadata presence

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
    [accountTokens, allMetadatas, enabledOnly]
  );
};

export const useAccountTokenBySlug = (slug: string) => {
  const accountTokens = useAvailableAccountTokens();

  return useMemo(() => accountTokens.find(t => t.slug === slug), [accountTokens, slug]);
};
