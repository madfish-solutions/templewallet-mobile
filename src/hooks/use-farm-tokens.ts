import { useMemo } from 'react';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { FarmToken } from 'src/interfaces/earn.interface';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';

export const useFarmTokens = (farm: Farm) => {
  const rewardToken: FarmToken = useMemo(
    () => ({
      symbol: farm.rewardToken.metadata.symbol,
      thumbnailUri: farm.rewardToken.metadata.thumbnailUri
    }),
    [farm]
  );

  const stakeTokens = useMemo(
    () =>
      farm.tokens.map(token => {
        const result: FarmToken = {
          symbol: token.metadata.symbol,
          thumbnailUri: token.metadata.thumbnailUri
        };

        if (token.metadata.symbol.toLowerCase() === TEZ_TOKEN_SLUG) {
          result.iconName = IconNameEnum.TezToken;
        }

        return result;
      }),
    [farm]
  );

  return { rewardToken, stakeTokens };
};
