import { useCallback, useMemo } from 'react';

import { TEZOS_CONTRACT_ADDRESS } from 'src/apis/quipuswap-staking/consts';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import { EarnOpportunityToken } from 'src/interfaces/earn-opportunity/earn-opportunity-token.interface';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { useCurrentAccountCollectibles, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { convertEarnOpportunityToken } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

export const useEarnOpportunityTokens = (earnOpportunity?: EarnOpportunity) => {
  const getExchangeRate = useTokenExchangeRateGetter();
  const tokens = useCurrentAccountTokens();
  const collectibles = useCurrentAccountCollectibles();
  const assets = useMemo(() => tokens.concat(collectibles), [tokens, collectibles]);
  const tezToken = useTezosTokenOfCurrentAccount();

  const convertToken = useCallback(
    (token: EarnOpportunityToken) => {
      const tokenAddress = token.contractAddress === TEZOS_CONTRACT_ADDRESS ? undefined : token.contractAddress;
      const tokenSlug = toTokenSlug(tokenAddress, token.fa2TokenId);
      const accountAsset = tokenSlug === TEZ_TOKEN_SLUG ? tezToken : assets.find(({ slug }) => slug === tokenSlug);

      return (
        accountAsset ?? {
          ...convertEarnOpportunityToken(token),
          exchangeRate: getExchangeRate(tokenSlug),
          balance: '0'
        }
      );
    },
    [getExchangeRate, assets, tezToken]
  );

  return useMemo(
    () => ({
      stakeTokens: earnOpportunity?.tokens.map(convertToken) ?? [],
      rewardToken: isDefined(earnOpportunity) ? convertToken(earnOpportunity.rewardToken) : emptyTezosLikeToken,
      stakedToken: isDefined(earnOpportunity) ? convertToken(earnOpportunity.stakedToken) : emptyTezosLikeToken
    }),
    [earnOpportunity, convertToken]
  );
};
