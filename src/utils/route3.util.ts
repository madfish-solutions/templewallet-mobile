import { BigNumber } from 'bignumber.js';
import { from, map } from 'rxjs';

import { route3Api } from 'src/apis/route3';
import { TEMPLE_TOKEN } from 'src/config/swap';
import {
  Hop,
  Route3Chain,
  Route3Dex,
  Route3SwapParamsRequest,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TEMPLE_WALLET_ROUTE3_AUTH_TOKEN } from './env.utils';
import { tzToMutez } from './tezos.util';

export const fetchRoute3Tokens$ = () =>
  from(route3Api.get<Array<Route3Token>>('/tokens')).pipe(map(response => response.data));

const parser = (origJSON: string): ReturnType<typeof JSON['parse']> => {
  const stringedJSON = origJSON
    .replace(/input":\s*([-+Ee0-9.]+)/g, 'input":"$1"')
    .replace(/output":\s*([-+Ee0-9.]+)/g, 'output":"$1"');

  return JSON.parse(stringedJSON);
};

export const fetchRoute3SwapParams = ({
  fromSymbol,
  toSymbol,
  amount,
  chainsLimit = 3
}: Route3SwapParamsRequest): Promise<Route3SwapParamsResponse> =>
  fetch(`https://temple.3route.io/v3/swap/${fromSymbol}/${toSymbol}/${amount}?chainsLimit=${chainsLimit}`, {
    headers: {
      Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
    }
  })
    .then(res => res.text())
    .then(res => parser(res));

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
        amount_opt: j === 0 ? tzToMutez(new BigNumber(chain.input), decimals) : null,
        params: ''
      });
    }
  }

  return hops;
};

export const getRoute3TokenSymbol = (token: TokenInterface) => {
  if (token.symbol === TEZ_TOKEN_METADATA.symbol) {
    return 'xtz';
  }

  return token.symbol;
};

export const getRoute3TokenBySlug = (route3Tokens: Array<Route3Token>, slug: string | undefined) => {
  if (slug === TEZ_TOKEN_SLUG) {
    return route3Tokens.find(({ contract }) => contract === null);
  }

  return route3Tokens.find(({ contract, tokenId }) => toTokenSlug(contract ?? '', tokenId ?? 0) === slug);
};

const TEMPLE_TOKEN_SLUG = `${TEMPLE_TOKEN.contract}_${TEMPLE_TOKEN.tokenId}`;

export const isInputTokenEqualToTempleToken = (inptuTokenSlug: string | undefined): boolean =>
  inptuTokenSlug === TEMPLE_TOKEN_SLUG;
