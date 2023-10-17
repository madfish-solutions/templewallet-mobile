import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';

import { UsableAccountAsset, buildUsableAccountAsset } from './utils';

export const useCurrentAccountTokens = (enabledOnly = false) => {
  const accountTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountTokens.reduce<UsableAccountAsset[]>((acc, curr) => {
        const token = buildUsableAccountAsset(
          curr,
          allMetadatas[curr.slug]! // `accountTokens` r already filtered for metadata presence
        );

        if (enabledOnly) {
          return token.visibility === VisibilityEnum.Visible ? acc.concat(token) : acc;
        }

        return acc.concat(token);
      }, []),
    [accountTokens, allMetadatas, enabledOnly]
  );
};

export const useAccountTokenBySlug = (slug: string): UsableAccountAsset | undefined => {
  const accountTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const allMetadatas = useTokensMetadataSelector();

  return useMemoWithCompare(
    () => {
      const token = accountTokens.find(t => t.slug === slug);

      return token ? buildUsableAccountAsset(token, allMetadatas[slug]!) : undefined;
    },
    [accountTokens, allMetadatas],
    isEqual
  );
};

export const useAccountTokensBalancesRecord = () => {
  const tokens = useCurrentAccountStoredAssetsSelector('tokens');

  return useMemo(
    () => tokens.reduce<Record<string, string>>((acc, curr) => ({ ...acc, [curr.slug]: curr.balance }), {}),
    [tokens]
  );
};
