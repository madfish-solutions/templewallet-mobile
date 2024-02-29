import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAssetBalanceSelector, useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';
import { TEMPLE_TOKEN_SLUG } from 'src/token/data/token-slugs';
import { TEMPLE_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';

import { UsableAccountAsset } from '../types';

import { buildUsableAccountAsset } from './utils';

export const useCurrentAccountTokens = (enabledOnly = false) => {
  const accountTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const allMetadatas = useTokensMetadataSelector();
  const getExchangeRate = useTokenExchangeRateGetter();

  return useMemo(
    () =>
      accountTokens.reduce<UsableAccountAsset[]>((acc, curr) => {
        const token = buildUsableAccountAsset(
          curr,
          allMetadatas[curr.slug]!, // `accountTokens` r already filtered for metadata presence
          getExchangeRate(curr.slug)
        );

        if (enabledOnly) {
          return token.visibility === VisibilityEnum.Visible ? acc.concat(token) : acc;
        }

        return acc.concat(token);
      }, []),
    [accountTokens, allMetadatas, enabledOnly, getExchangeRate]
  );
};

export const useAccountTokenBySlug = (slug: string): UsableAccountAsset | undefined => {
  const accountTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const allMetadatas = useTokensMetadataSelector();
  const exchageRate = useAssetExchangeRate(slug);

  return useMemoWithCompare(
    () => {
      const metadata = allMetadatas[slug];

      const token = accountTokens.find(t => t.slug === slug);

      if (!metadata || !token) {
        console.warn(`Token for slug '${slug}' is not ready`);

        return undefined;
      }

      return buildUsableAccountAsset(token, metadata, exchageRate);
    },
    [slug, accountTokens, allMetadatas, exchageRate],
    isEqual
  );
};

export const useAccountTkeyToken = (): UsableAccountAsset => {
  const balance = useAssetBalanceSelector(TEMPLE_TOKEN_SLUG);
  const token: AccountTokenInterface = useMemo(
    () => ({
      slug: TEMPLE_TOKEN_SLUG,
      balance: balance ?? '0',
      visibility: VisibilityEnum.Visible,
      isVisible: true
    }),
    [balance]
  );
  const exchageRate = useAssetExchangeRate(TEMPLE_TOKEN_SLUG);

  return useMemo(() => buildUsableAccountAsset(token, TEMPLE_TOKEN_METADATA, exchageRate), [token, exchageRate]);
};

export const useAccountTokensBalancesRecord = () => {
  const tokens = useCurrentAccountStoredAssetsSelector('tokens');

  return useMemo(
    () => tokens.reduce<Record<string, string>>((acc, curr) => ({ ...acc, [curr.slug]: curr.balance }), {}),
    [tokens]
  );
};
