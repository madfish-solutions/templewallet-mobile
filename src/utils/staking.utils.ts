import { TEZOS_CONTRACT_ADDRESS } from 'src/apis/quipuswap-staking/consts';
import { FarmToken, FarmTokenStandardsEnum } from 'src/apis/quipuswap-staking/types';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const convertFarmToken = (rawToken: FarmToken): TokenInterface => {
  const { fa2TokenId, contractAddress, metadata, type } = rawToken;
  const { name, symbol, decimals, thumbnailUri } = metadata;

  return {
    balance: '0',
    visibility: VisibilityEnum.Visible,
    id: fa2TokenId ?? 0,
    address: contractAddress === TEZOS_CONTRACT_ADDRESS ? '' : contractAddress,
    iconName: contractAddress === TEZOS_CONTRACT_ADDRESS ? IconNameEnum.TezToken : undefined,
    name,
    symbol,
    decimals,
    thumbnailUri,
    standard: type === FarmTokenStandardsEnum.Fa2 ? TokenStandardsEnum.Fa2 : TokenStandardsEnum.Fa12
  };
};
