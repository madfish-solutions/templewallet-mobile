import { QuipuswapAPIToken, QuipuswapAPITokenStandardsEnum } from 'src/apis/quipuswap/types';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const convertFarmToken = (rawToken: QuipuswapAPIToken): TokenInterface => {
  const { fa2TokenId, contractAddress, metadata, type } = rawToken;
  const { name, symbol, decimals, thumbnailUri } = metadata;

  return {
    balance: '0',
    visibility: VisibilityEnum.Visible,
    id: fa2TokenId ?? 0,
    address: contractAddress === 'tez' ? '' : contractAddress,
    name,
    symbol,
    decimals,
    thumbnailUri,
    standard: type === QuipuswapAPITokenStandardsEnum.Fa2 ? TokenStandardsEnum.Fa2 : TokenStandardsEnum.Fa12
  };
};
