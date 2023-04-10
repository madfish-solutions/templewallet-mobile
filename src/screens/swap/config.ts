import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

export const ROUTING_FEE_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const ROUTE3_CONTRACT = 'KT1Tuta6vbpHhZ15ixsYD3qJdhnpEAuogLQ9';

export const ROUTING_FEE_PERCENT = 0.35;
export const ROUTING_FEE_RATIO = (100 - ROUTING_FEE_PERCENT) / 100;
export const TEMPLE_TOKEN: Route3Token = {
  id: 30,
  symbol: 'WBUSD',
  standard: Route3TokenStandardEnum.fa2,
  contract: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
  tokenId: '1',
  decimals: 18
};
