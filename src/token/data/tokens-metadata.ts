import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { emptyTokenMetadata, TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const TEZ_TOKEN_SLUG = 'tez';

export const TEZ_TOKEN_METADATA: TokenMetadataInterface = {
  ...emptyTokenMetadata,
  name: 'Tezos',
  symbol: 'TEZ',
  decimals: 6,
  iconName: IconNameEnum.TezToken
};

export const FILM_TOKEN_METADATA: TokenMetadataInterface = {
  ...emptyTokenMetadata,
  name: 'FILM',
  symbol: 'FILM',
  decimals: 6,
  iconName: IconNameEnum.FilmToken
};

export const DCP_TOKENS_METADATA: TokenMetadataInterface[] = [
  {
    id: 0,
    address: 'KT1N7Rh6SgSdExMPxfnYw1tHqrkSm7cm6JDN',
    decimals: 0,
    symbol: 'APX',
    name: 'APXCOIN',
    thumbnailUri: 'https://loonfilms.com/apx/apx-coin-220px.png'
  }
];
