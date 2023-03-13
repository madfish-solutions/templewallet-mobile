import { BigNumber } from 'bignumber.js';
import { from, map } from 'rxjs';

import { route3Api } from 'src/apis/route3';
import {
  Hop,
  Route3Chain,
  Route3Dex,
  Route3SwapParamsRequest,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

export const fetchRoute3Tokens = () =>
  from(route3Api.get<Array<Route3Token>>('/tokens')).pipe(map(response => response.data));

export const fetchRoute3SwapParams = ({ fromSymbol, toSymbol, amount }: Route3SwapParamsRequest) =>
  route3Api.get<Route3SwapParamsResponse>(`/swap/${fromSymbol}/${toSymbol}/${amount}`).then(({ data }) => data);

export const fetchRoute3Dexes$ = () =>
  from(route3Api.get<Array<Route3Dex>>('/dexes')).pipe(map(response => response.data));

export const mapToRoute3ExecuteHops = (chains: Array<Route3Chain>, decimals: number) => {
  const hops = new Array<Hop>();

  for (const chain of chains) {
    for (let j = 0; j < chain.hops.length; j++) {
      const hop = chain.hops[j];
      hops.push({
        code: (j === 0 ? 1 : 0) + (hop.forward ? 2 : 0),
        dex_id: hop.dex,
        amount_opt: j === 0 ? new BigNumber(chain.input).multipliedBy(10 ** decimals) : null
      });
    }
  }

  return hops;
};

export const getRoute3TokenSymbol = (token: TokenInterface) => {
  if (token.symbol === 'TEZ') {
    return 'xtz';
  }

  return token.symbol;
};

export const getRoute3Token = (token: TokenInterface, route3Tokens: Array<Route3Token>) => {
  const fromTokenSlug = toTokenSlug(token.address, token.id);

  return route3Tokens.find(({ contract, tokenId }) => toTokenSlug(contract ?? '', tokenId ?? 0) === fromTokenSlug);
};
