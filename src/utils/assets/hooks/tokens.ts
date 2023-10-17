import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';

import { UsableAccountAsset } from './utils';

export const useCurrentAccountTokens = (enabledOnly = false) => {
  const accountTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountTokens.reduce<UsableAccountAsset[]>((acc, { slug, balance, visibility }) => {
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
    [accountTokens, allMetadatas, enabledOnly]
  );
};

export const useAccountTokenBySlug = (slug: string) => {
  const accountTokens = useCurrentAccountTokens();

  return useMemo(() => accountTokens.find(t => t.slug === slug), [accountTokens, slug]);
};

export const useAccountTokensBalancesRecord = () => {
  const tokens = useCurrentAccountStoredAssetsSelector('tokens');

  return useMemo(
    () => tokens.reduce<Record<string, string>>((acc, curr) => ({ ...acc, [curr.slug]: curr.balance }), {}),
    [tokens]
  );
};
