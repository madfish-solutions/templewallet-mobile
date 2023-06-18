import { TokenSymbol } from './token';

enum TokenType {
  NATIVE = 0,
  FA1p2 = 1,
  FA2 = 2
}

export interface Token {
  id: TokenSymbol;
  type: TokenType;
  name: string; // Human readable name, eg. "XTZ/tzBTC Liquidity Baking Pool Token"
  shortName: string; // Human readable short name, eg. "tzBTC LB"
  decimals: number;
  symbol: TokenSymbol;
  targetSymbol: string;
  unit: string;
  impliedPrice: number;
  contractAddress: string;
  tokenId: number;
  decimalPlaces: number;
  inputDecimalPlaces: number;
  _3RouteId?: number;
}

export enum FarmType {
  NO_LOCK = 1,
  INCENTIVISED = 2,
  PLENTY = 3
}

export interface Farm {
  type: FarmType;
  token1: Token;
  token2: Token;
  lpToken: Token;
  rewardToken: Token;
  farmContract: string;
  dexType: DexType;
  expectedWeeklyRewards: number;
  rewardStart?: Date;
  active: boolean;
  timeLockNotice?: boolean;
  deactivatedNotice?: boolean;
  swapAddress?: string;
}

interface FlatYouvesExchangeInfo {
  token1: Token;
  token2: Token;
  dexType: DexType.FLAT_CURVE;
  contractAddress: string;
  liquidityToken: Token;
}

interface CheckerExchangeInfo {
  token1: Token;
  token2: Token;
  dexType: DexType.CHECKER;
  contractAddress: string;
  liquidityToken: Token;
}

interface QuipuswapExchangeInfo {
  token1: Token;
  token2: Token;
  dexType: DexType.QUIPUSWAP;
  address: string;
  liquidityToken: Token;
}

interface PlentyExchangeInfo {
  token1: Token;
  token2: Token;
  dexType: DexType.PLENTY;
  address: string;
  liquidityToken: Token;
}

export type ExchangePair = FlatYouvesExchangeInfo | CheckerExchangeInfo | QuipuswapExchangeInfo | PlentyExchangeInfo;
export interface NetworkConstants {
  fakeAddress: string;
  natViewerCallback: string;
  balanceOfViewerCallback: string;
  addressViewerCallback: string;
  tokens: Record<TokenSymbol, Token>;
  farms: Farm[];
  dexes: ExchangePair[];
  unifiedStaking: string;
  ctezTezDex: string;
}

export enum DexType {
  QUIPUSWAP = 'quipuswap',
  PLENTY = 'plenty',
  FLAT_CURVE = 'flat_curve',
  CHECKER = 'checker',
  _3ROUTE = '3route'
}

export const xtzToken: Omit<Token, 'contractAddress'> = {
  id: 'tez',
  type: TokenType.NATIVE,
  name: 'Tezos',
  shortName: 'tez',
  decimals: 6,
  symbol: 'tez',
  targetSymbol: 'tez',
  unit: 'tez',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 0
};

export const youToken: Omit<Token, 'contractAddress'> = {
  id: 'YOU',
  type: TokenType.FA2,
  name: 'Youves Governance YOU',
  shortName: 'YOU',
  decimals: 12,
  symbol: 'YOU',
  targetSymbol: 'YOU',
  unit: 'YOU',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 17
};

export const tzbtcLPToken: Omit<Token, 'contractAddress'> = {
  id: 'sirs',
  type: TokenType.FA1p2,
  name: 'Sirius',
  shortName: 'SIRS',
  decimals: 0,
  symbol: 'sirs',
  targetSymbol: 'SIRS',
  unit: 'SIRS',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 127
};

export const tzbtcToken: Omit<Token, 'contractAddress'> = {
  id: 'tzbtc',
  type: TokenType.FA1p2,
  name: 'tzBTC',
  shortName: 'tzBTC',
  decimals: 8,
  symbol: 'tzbtc',
  targetSymbol: 'tzBTC',
  unit: 'tzBTC',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 8,
  _3RouteId: 2
};

export const kusdToken: Omit<Token, 'contractAddress'> = {
  id: 'kusd',
  type: TokenType.FA1p2,
  name: 'Kolibri USD',
  shortName: 'kUSD',
  decimals: 18,
  symbol: 'kusd',
  targetSymbol: 'kUSD',
  unit: 'kUSD',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 1
};

export const usdtToken: Omit<Token, 'contractAddress'> = {
  id: 'usdt',
  type: TokenType.FA2,
  name: 'USDt',
  shortName: 'USDt',
  decimals: 6,
  symbol: 'usdt',
  targetSymbol: 'USDt',
  unit: 'USDt',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 48
};

export const usdtzToken: Omit<Token, 'contractAddress'> = {
  id: 'usdtz',
  type: TokenType.FA1p2,
  name: 'USDtz',
  shortName: 'USDtz',
  decimals: 6,
  symbol: 'usdtz',
  targetSymbol: 'USDtz',
  unit: 'USDtz',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 3
};

export const ctezToken: Omit<Token, 'contractAddress'> = {
  id: 'ctez',
  type: TokenType.FA1p2,
  name: 'ctez',
  shortName: 'ctez',
  decimals: 6,
  symbol: 'ctez',
  targetSymbol: 'ctez',
  unit: 'ctez',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 18
};

export const uusdToken: Omit<Token, 'contractAddress'> = {
  id: 'uUSD',
  type: TokenType.FA2,
  name: 'youves uUSD',
  shortName: 'uUSD',
  decimals: 12,
  symbol: 'uUSD',
  targetSymbol: 'USD',
  unit: 'uUSD',
  impliedPrice: 1.25,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 12
};

export const udefiToken: Omit<Token, 'contractAddress'> = {
  id: 'uDEFI',
  type: TokenType.FA2,
  name: 'youves uDEFI',
  shortName: 'uDEFI',
  decimals: 12,
  symbol: 'uDEFI',
  targetSymbol: 'DEFI',
  unit: 'uDEFI',
  impliedPrice: 1.25,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 19
};

export const ubtcToken: Omit<Token, 'contractAddress'> = {
  id: 'uBTC',
  type: TokenType.FA2,
  name: 'youves uBTC',
  shortName: 'uBTC',
  decimals: 12,
  symbol: 'uBTC',
  targetSymbol: 'BTC',
  unit: 'uBTC',
  impliedPrice: 1.25,
  tokenId: 2,
  decimalPlaces: 8,
  inputDecimalPlaces: 8,
  _3RouteId: 49
};

export const uxtzToken: Omit<Token, 'contractAddress'> = {
  id: 'uXTZ',
  type: TokenType.FA2,
  name: 'youves uXTZ',
  shortName: 'uXTZ',
  decimals: 12,
  symbol: 'uXTZ',
  targetSymbol: 'XTZ',
  unit: 'uXTZ',
  impliedPrice: 1.25,
  tokenId: 3,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 125
};

export const cchfToken: Omit<Token, 'contractAddress'> = {
  id: 'cCHF',
  type: TokenType.FA2,
  name: 'youves cCHF',
  shortName: 'cCHF',
  decimals: 12,
  symbol: 'cCHF',
  targetSymbol: 'CHF',
  unit: 'cCHF',
  impliedPrice: 1.25,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const plentyToken: Omit<Token, 'contractAddress'> = {
  id: 'plenty',
  type: TokenType.FA1p2,
  name: 'Plenty',
  shortName: 'Plenty',
  decimals: 18,
  symbol: 'plenty',
  targetSymbol: 'plenty',
  unit: 'plenty',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 10
};

export const quipuToken: Omit<Token, 'contractAddress'> = {
  id: 'quipu',
  type: TokenType.FA2,
  name: 'Quipu',
  shortName: 'Quipu',
  decimals: 6,
  symbol: 'quipu',
  targetSymbol: 'quipu',
  unit: 'quipu',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 14
};

export const wusdc: Omit<Token, 'contractAddress'> = {
  id: 'wusdc',
  type: TokenType.FA2,
  name: 'wUSDC',
  shortName: 'wUSDC',
  decimals: 6,
  symbol: 'wusdc',
  targetSymbol: 'wUSDC',
  unit: 'wusdc',
  impliedPrice: 1,
  tokenId: 17,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 28
};

export const wwbtc: Omit<Token, 'contractAddress'> = {
  id: 'wwbtc',
  type: TokenType.FA2,
  name: 'wwBTC',
  shortName: 'wwBTC',
  decimals: 8,
  symbol: 'wwbtc',
  targetSymbol: 'wwBTC',
  unit: 'wwbtc',
  impliedPrice: 1,
  tokenId: 19,
  decimalPlaces: 8,
  inputDecimalPlaces: 8,
  _3RouteId: 34
};

export const usdce: Omit<Token, 'contractAddress'> = {
  id: 'usdce',
  type: TokenType.FA2,
  name: 'USDC.e',
  shortName: 'USDC.e',
  decimals: 6,
  symbol: 'usdce',
  targetSymbol: 'USDC.e',
  unit: 'usdce',
  impliedPrice: 1,
  tokenId: 2,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 42
};

export const wbtce: Omit<Token, 'contractAddress'> = {
  id: 'wbtce',
  type: TokenType.FA2,
  name: 'WBTC.e',
  shortName: 'WBTC.e',
  decimals: 8,
  symbol: 'wbtce',
  targetSymbol: 'WBTC.e',
  unit: 'wbtce',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 8,
  inputDecimalPlaces: 8,
  _3RouteId: 41
};

export const uusdwusdcLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdwusdcLP',
  type: TokenType.FA1p2,
  name: 'uUSD/wUSDC LP',
  shortName: 'uUSD/wUSDC LP',
  decimals: 12,
  symbol: 'uusdwusdcLP',
  targetSymbol: 'uUSD/wUSDC LP',
  unit: 'uusdwusdcLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const ubtctzbtcLP: Omit<Token, 'contractAddress'> = {
  id: 'ubtctzbtcLP',
  type: TokenType.FA1p2,
  name: 'uBTC/tzBTC LP',
  shortName: 'uBTC/tzBTC LP',
  decimals: 12,
  symbol: 'ubtctzbtcLP',
  targetSymbol: 'uBTC/tzBTC LP',
  unit: 'ubtctzbtcLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 12
};

export const tzbtcwwbtcLP: Omit<Token, 'contractAddress'> = {
  id: 'tzbtcwwbtcLP',
  type: TokenType.FA1p2,
  name: 'tzBTC/wWBTC LP',
  shortName: 'tzBTC/wWBTC LP',
  decimals: 8,
  symbol: 'tzbtcwwbtcLP',
  targetSymbol: 'tzBTC/wWBTC LP',
  unit: 'tzbtcwwbtcLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 8
};

export const uusdyouLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdyouLP',
  type: TokenType.FA1p2,
  name: 'uUSD/YOU LP',
  shortName: 'uUSD/YOU LP',
  decimals: 18,
  symbol: 'uusdyouLP',
  targetSymbol: 'uUSD/YOU LP',
  unit: 'uusdyouLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 8
};

export const uusdudefiLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdudefiLP',
  type: TokenType.FA1p2,
  name: 'uUSD/uDEFI LP',
  shortName: 'uUSD/uDEFI LP',
  decimals: 12,
  symbol: 'uusdudefiLP',
  targetSymbol: 'uUSD/uDEFI LP',
  unit: 'uusdudefiLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdkusdLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdkusdLP',
  type: TokenType.FA1p2,
  name: 'uUSD/kUSD LP',
  shortName: 'uUSD/kUSD LP',
  decimals: 18,
  symbol: 'uusdkusdLP',
  targetSymbol: 'uUSD/kUSD LP',
  unit: 'uusdkusdLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdusdtzLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdusdtzLP',
  type: TokenType.FA1p2,
  name: 'uUSD/USDtz LP',
  shortName: 'uUSD/USDtz LP',
  decimals: 12,
  symbol: 'uusdusdtzLP',
  targetSymbol: 'uUSD/USDtz LP',
  unit: 'uusdusdtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdubtcLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdubtcLP',
  type: TokenType.FA2,
  name: 'uUSD/uBTC LP',
  shortName: 'uUSD/uBTC LP',
  decimals: 6,
  symbol: 'uusdubtcLP',
  targetSymbol: 'uUSD/uBTC LP',
  unit: 'uusdubtcLP',
  impliedPrice: 1,
  tokenId: 21,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdxtzLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdxtzLP',
  type: TokenType.FA2,
  name: 'uUSD/XTZ LP',
  shortName: 'uUSD/XTZ LP',
  decimals: 6,
  symbol: 'uusdxtzLP',
  targetSymbol: 'uUSD/XTZ LP',
  unit: 'uusdxtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uxtzxtzLP: Omit<Token, 'contractAddress'> = {
  id: 'uxtzxtzLP',
  type: TokenType.FA1p2,
  name: 'uXTZ/XTZ LP',
  shortName: 'uXTZ/XTZ LP',
  decimals: 12,
  symbol: 'uxtzxtzLP',
  targetSymbol: 'uXTZ/XTZ LP',
  unit: 'uxtzxtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const youxtzLP: Omit<Token, 'contractAddress'> = {
  id: 'youxtzLP',
  type: TokenType.FA2,
  name: 'YOU/XTZ LP',
  shortName: 'YOU/XTZ LP',
  decimals: 6,
  symbol: 'youxtzLP',
  targetSymbol: 'YOU/XTZ LP',
  unit: 'youxtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const udefixtzLP: Omit<Token, 'contractAddress'> = {
  id: 'udefixtzLP',
  type: TokenType.FA2,
  name: 'uDEFI/XTZ LP',
  shortName: 'uDEFI/XTZ LP',
  decimals: 6,
  symbol: 'udefixtzLP',
  targetSymbol: 'uDEFI/XTZ LP',
  unit: 'udefixtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdquipuLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdquipuLP',
  type: TokenType.FA2,
  name: 'uUSD/QUIPU LP',
  shortName: 'uUSD/QUIPU LP',
  decimals: 6,
  symbol: 'uusdquipuLP',
  targetSymbol: 'uUSD/QUIPU LP',
  unit: 'uusdquipuLP',
  impliedPrice: 1,
  tokenId: 7,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdusdtLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdusdtLP',
  type: TokenType.FA1p2,
  name: 'uUSD/USDt LP',
  shortName: 'uUSD/USDt LP',
  decimals: 12,
  symbol: 'uusdusdtLP',
  targetSymbol: 'uUSD/USDt LP',
  unit: 'uusdusdtLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const uusdusdceLP: Omit<Token, 'contractAddress'> = {
  id: 'uusdusdceLP',
  type: TokenType.FA1p2,
  name: 'uUSD/USDC.e LP',
  shortName: 'uUSD/USDC.e LP',
  decimals: 12,
  symbol: 'uusdusdceLP',
  targetSymbol: 'uUSD/USDC.e LP',
  unit: 'uusdusdceLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const ubtcwbtceLP: Omit<Token, 'contractAddress'> = {
  id: 'ubtcwbtceLP',
  type: TokenType.FA1p2,
  name: 'uBTC/WBTC.e LP',
  shortName: 'uBTC/WBTC.e LP',
  decimals: 12,
  symbol: 'ubtcwbtceLP',
  targetSymbol: 'uBTC/WBTC.e LP',
  unit: 'ubtcwbtceLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 12
};

export const ctezcchfLP: Omit<Token, 'contractAddress'> = {
  id: 'ctezcchfLP',
  type: TokenType.FA2,
  name: 'ctez/cCHF LP',
  shortName: 'ctez/cCHF LP',
  decimals: 6,
  symbol: 'ctezcchfLP',
  targetSymbol: 'ctez/cCHF LP',
  unit: 'ctezcchfLP',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const ctezxtzLP: Omit<Token, 'contractAddress'> = {
  id: 'ctezxtzLP',
  type: TokenType.FA2,
  name: 'ctez/XTZ LP',
  shortName: 'ctez/XTZ LP',
  decimals: 6,
  symbol: 'ctezxtzLP',
  targetSymbol: 'ctez/XTZ LP',
  unit: 'ctezxtzLP',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4
};

export const youuxtzLP: Omit<Token, 'contractAddress'> = {
  id: 'youuxtzLP',
  type: TokenType.FA1p2,
  name: 'YOU/uXTZ LP',
  shortName: 'YOU/uXTZ LP',
  decimals: 18,
  symbol: 'youuxtzLP',
  targetSymbol: 'YOU/uXTZ LP',
  unit: 'youuxtzLP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 8,
  inputDecimalPlaces: 8
};

//3route tokens

//example
// export const kussdToken: Omit<Token, 'contractAddress'> = {
//   id: 'kusd',
//   type: TokenType.FA1p2,
//   name: 'Kolibri USD',
//   shortName: 'kUSD',
//   decimals: 18,
//   symbol: 'kusd',
//   targetSymbol: 'kUSD',
//   unit: 'kUSD',
//   impliedPrice: 1,
//   tokenId: 0,
//   decimalPlaces: 2,
//   inputDecimalPlaces: 4
// }

export const ethtzToken: Omit<Token, 'contractAddress'> = {
  id: 'ETHtz',
  type: TokenType.FA1p2,
  name: 'ETHtez',
  shortName: 'ETHtz',
  decimals: 18,
  symbol: 'ETHtz',
  targetSymbol: 'ETHtz',
  unit: 'ETHtz',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 4
};

export const wxtzToken: Omit<Token, 'contractAddress'> = {
  id: 'wXTZ',
  type: TokenType.FA1p2,
  name: 'Wrapped Tezos',
  shortName: 'wXTZ',
  decimals: 6,
  symbol: 'wXTZ',
  targetSymbol: 'wXTZ',
  unit: 'wXTZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 5
};

export const kdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'kDAO',
  type: TokenType.FA1p2,
  name: 'Kolibri DAO',
  shortName: 'kDAO',
  decimals: 18,
  symbol: 'kDAO',
  targetSymbol: 'kDAO',
  unit: 'kDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 6
};

export const smakToken: Omit<Token, 'contractAddress'> = {
  id: 'SMAK',
  type: TokenType.FA1p2,
  name: 'Smartlink',
  shortName: 'SMAK',
  decimals: 18,
  symbol: 'SMAK',
  targetSymbol: 'SMAK',
  unit: 'SMAK',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 7
};

export const paulToken: Omit<Token, 'contractAddress'> = {
  id: 'PAUL',
  type: TokenType.FA1p2,
  name: 'Aliens Farm PAUL',
  shortName: 'PAUL',
  decimals: 8,
  symbol: 'PAUL',
  targetSymbol: 'PAUL',
  unit: 'PAUL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 8
};

export const dogaToken: Omit<Token, 'contractAddress'> = {
  id: 'DOGA',
  type: TokenType.FA1p2,
  name: 'DOGAMÍ',
  shortName: 'DOGA',
  decimals: 5,
  symbol: 'DOGA',
  targetSymbol: 'DOGA',
  unit: 'DOGA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 9
};

export const usdsToken: Omit<Token, 'contractAddress'> = {
  id: 'USDS',
  type: TokenType.FA2,
  name: 'Stably USD',
  shortName: 'USDS',
  decimals: 6,
  symbol: 'USDS',
  targetSymbol: 'USDS',
  unit: 'USDS',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 11
};

export const wrapToken: Omit<Token, 'contractAddress'> = {
  id: 'WRAP',
  type: TokenType.FA2,
  name: 'WRAP',
  shortName: 'WRAP',
  decimals: 6,
  symbol: 'WRAP',
  targetSymbol: 'WRAP',
  unit: 'WRAP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 13
};

export const unoToken: Omit<Token, 'contractAddress'> = {
  id: 'UNO',
  type: TokenType.FA2,
  name: 'Tezotopia Unobtanium',
  shortName: 'UNO',
  decimals: 9,
  symbol: 'UNO',
  targetSymbol: 'UNO',
  unit: 'UNO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 15
};

export const hdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'hDAO',
  type: TokenType.FA2,
  name: 'Hic et nunc DAO',
  shortName: 'hDAO',
  decimals: 6,
  symbol: 'hDAO',
  targetSymbol: 'hDAO',
  unit: 'hDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 16
};

export const instaToken: Omit<Token, 'contractAddress'> = {
  id: 'INSTA',
  type: TokenType.FA2,
  name: 'Instaraise',
  shortName: 'INSTA',
  decimals: 9,
  symbol: 'INSTA',
  targetSymbol: 'INSTA',
  unit: 'INSTA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 20
};

export const crunchToken: Omit<Token, 'contractAddress'> = {
  id: 'CRUNCH',
  type: TokenType.FA2,
  name: 'CRUNCH',
  shortName: 'CRUNCH',
  decimals: 8,
  symbol: 'CRUNCH',
  targetSymbol: 'CRUNCH',
  unit: 'CRUNCH',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 21
};

export const flameToken: Omit<Token, 'contractAddress'> = {
  id: 'FLAME',
  type: TokenType.FA2,
  name: 'FLAME',
  shortName: 'FLAME',
  decimals: 6,
  symbol: 'FLAME',
  targetSymbol: 'FLAME',
  unit: 'FLAME',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 22
};

export const gifToken: Omit<Token, 'contractAddress'> = {
  id: 'GIF',
  type: TokenType.FA2,
  name: 'GIF DAO',
  shortName: 'GIF',
  decimals: 9,
  symbol: 'GIF',
  targetSymbol: 'GIF',
  unit: 'GIF',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 23
};

export const kalamToken: Omit<Token, 'contractAddress'> = {
  id: 'KALAM',
  type: TokenType.FA2,
  name: 'Kalamint',
  shortName: 'KALAM',
  decimals: 10,
  symbol: 'KALAM',
  targetSymbol: 'KALAM',
  unit: 'KALAM',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 24
};

export const pxlToken: Omit<Token, 'contractAddress'> = {
  id: 'PXL',
  type: TokenType.FA2,
  name: 'Pixel Token',
  shortName: 'PXL',
  decimals: 6,
  symbol: 'PXL',
  targetSymbol: 'PXL',
  unit: 'PXL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 25
};

export const crdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'crDAO',
  type: TokenType.FA2,
  name: 'Crunchy DAO',
  shortName: 'crDAO',
  decimals: 8,
  symbol: 'crDAO',
  targetSymbol: 'crDAO',
  unit: 'crDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 26
};

export const wtzToken: Omit<Token, 'contractAddress'> = {
  id: 'WTZ',
  type: TokenType.FA2,
  name: 'Wrapped Tezos',
  shortName: 'WTZ',
  decimals: 6,
  symbol: 'WTZ',
  targetSymbol: 'WTZ',
  unit: 'WTZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 27
};

export const wusdtToken: Omit<Token, 'contractAddress'> = {
  id: 'wUSDT',
  type: TokenType.FA2,
  name: 'Wrapped USDT',
  shortName: 'wUSDT',
  decimals: 6,
  symbol: 'wUSDT',
  targetSymbol: 'wUSDT',
  unit: 'wUSDT',
  impliedPrice: 1,
  tokenId: 18,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 29
};

export const wbusdToken: Omit<Token, 'contractAddress'> = {
  id: 'wBUSD',
  type: TokenType.FA2,
  name: 'Wrapped BUSD',
  shortName: 'wBUSD',
  decimals: 6,
  symbol: 'wBUSD',
  targetSymbol: 'wBUSD',
  unit: 'wBUSD',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 30
};

export const wpaxToken: Omit<Token, 'contractAddress'> = {
  id: 'wPAX',
  type: TokenType.FA2,
  name: 'Wrapped PAX',
  shortName: 'wPAX',
  decimals: 18,
  symbol: 'wPAX',
  targetSymbol: 'wPAX',
  unit: 'wPAX',
  impliedPrice: 1,
  tokenId: 14,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 31
};

export const wdaiToken: Omit<Token, 'contractAddress'> = {
  id: 'wDAI',
  type: TokenType.FA2,
  name: 'Wrapped DAI',
  shortName: 'wDAI',
  decimals: 18,
  symbol: 'wDAI',
  targetSymbol: 'wDAI',
  unit: 'wDAI',
  impliedPrice: 1,
  tokenId: 5,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 32
};

export const wwethToken: Omit<Token, 'contractAddress'> = {
  id: 'wWETH',
  type: TokenType.FA2,
  name: 'Wrapped WETH',
  shortName: 'wWETH',
  decimals: 18,
  symbol: 'wWETH',
  targetSymbol: 'wWETH',
  unit: 'wWETH',
  impliedPrice: 1,
  tokenId: 20,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 33
};

export const wmaticToken: Omit<Token, 'contractAddress'> = {
  id: 'wMATIC',
  type: TokenType.FA2,
  name: 'Wrapped MATIC',
  shortName: 'wMATIC',
  decimals: 18,
  symbol: 'wMATIC',
  targetSymbol: 'wMATIC',
  unit: 'wMATIC',
  impliedPrice: 1,
  tokenId: 11,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 35
};

export const wlinkToken: Omit<Token, 'contractAddress'> = {
  id: 'wLINK',
  type: TokenType.FA2,
  name: 'Wrapped LINK',
  shortName: 'wLINK',
  decimals: 18,
  symbol: 'wLINK',
  targetSymbol: 'wLINK',
  unit: 'wLINK',
  impliedPrice: 1,
  tokenId: 10,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 36
};

export const wuniToken: Omit<Token, 'contractAddress'> = {
  id: 'wUNI',
  type: TokenType.FA2,
  name: 'Wrapped UNI',
  shortName: 'wUNI',
  decimals: 18,
  symbol: 'wUNI',
  targetSymbol: 'wUNI',
  unit: 'wUNI',
  impliedPrice: 1,
  tokenId: 16,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 37
};

export const waaveToken: Omit<Token, 'contractAddress'> = {
  id: 'wAAVE',
  type: TokenType.FA2,
  name: 'Wrapped AAVE',
  shortName: 'wAAVE',
  decimals: 18,
  symbol: 'wAAVE',
  targetSymbol: 'wAAVE',
  unit: 'wAAVE',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 38
};

export const whusdToken: Omit<Token, 'contractAddress'> = {
  id: 'wHUSD',
  type: TokenType.FA2,
  name: 'Wrapped HUSD',
  shortName: 'wHUSD',
  decimals: 8,
  symbol: 'wHUSD',
  targetSymbol: 'wHUSD',
  unit: 'wHUSD',
  impliedPrice: 1,
  tokenId: 8,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 39
};

export const wetheToken: Omit<Token, 'contractAddress'> = {
  id: 'WETH.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge WETH',
  shortName: 'WETH.e',
  decimals: 18,
  symbol: 'WETH.e',
  targetSymbol: 'WETH.e',
  unit: 'WETH.e',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 40
};

export const usdteToken: Omit<Token, 'contractAddress'> = {
  id: 'USDT.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge USDT',
  shortName: 'USDT.e',
  decimals: 6,
  symbol: 'USDT.e',
  targetSymbol: 'USDT.e',
  unit: 'USDT.e',
  impliedPrice: 1,
  tokenId: 3,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 43
};

export const maticeToken: Omit<Token, 'contractAddress'> = {
  id: 'MATIC.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge MATIC',
  shortName: 'MATIC.e',
  decimals: 18,
  symbol: 'MATIC.e',
  targetSymbol: 'MATIC.e',
  unit: 'MATIC.e',
  impliedPrice: 1,
  tokenId: 4,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 44
};

export const linkeToken: Omit<Token, 'contractAddress'> = {
  id: 'LINK.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge LINK',
  shortName: 'LINK.e',
  decimals: 18,
  symbol: 'LINK.e',
  targetSymbol: 'LINK.e',
  unit: 'LINK.e',
  impliedPrice: 1,
  tokenId: 5,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 45
};

export const daieToken: Omit<Token, 'contractAddress'> = {
  id: 'DAI.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge DAI',
  shortName: 'DAI.e',
  decimals: 18,
  symbol: 'DAI.e',
  targetSymbol: 'DAI.e',
  unit: 'DAI.e',
  impliedPrice: 1,
  tokenId: 6,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 46
};

export const busdeToken: Omit<Token, 'contractAddress'> = {
  id: 'BUSD.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge BUSD',
  shortName: 'BUSD.e',
  decimals: 18,
  symbol: 'BUSD.e',
  targetSymbol: 'BUSD.e',
  unit: 'BUSD.e',
  impliedPrice: 1,
  tokenId: 7,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 47
};

export const eurlToken: Omit<Token, 'contractAddress'> = {
  id: 'EURL',
  type: TokenType.FA2,
  name: 'EURL',
  shortName: 'EURL',
  decimals: 6,
  symbol: 'EURL',
  targetSymbol: 'EURL',
  unit: 'EURL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 50
};

export const ageureToken: Omit<Token, 'contractAddress'> = {
  id: 'AGEUR.e',
  type: TokenType.FA2,
  name: 'Plenty Bridge AGEUR',
  shortName: 'AGEUR.e',
  decimals: 18,
  symbol: 'AGEUR.e',
  targetSymbol: 'AGEUR.e',
  unit: 'AGEUR.e',
  impliedPrice: 1,
  tokenId: 8,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 51
};

export const wrcToken: Omit<Token, 'contractAddress'> = {
  id: 'WRC',
  type: TokenType.FA2,
  name: 'Werecoin',
  shortName: 'WRC',
  decimals: 18,
  symbol: 'WRC',
  targetSymbol: 'WRC',
  unit: 'WRC',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 52
};

export const mttrToken: Omit<Token, 'contractAddress'> = {
  id: 'MTTR',
  type: TokenType.FA2,
  name: 'Matter',
  shortName: 'MTTR',
  decimals: 12,
  symbol: 'MTTR',
  targetSymbol: 'MTTR',
  unit: 'MTTR',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 53
};

export const spiToken: Omit<Token, 'contractAddress'> = {
  id: 'SPI',
  type: TokenType.FA2,
  name: 'Spice Token',
  shortName: 'SPI',
  decimals: 6,
  symbol: 'SPI',
  targetSymbol: 'SPI',
  unit: 'SPI',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 54
};

export const rsalToken: Omit<Token, 'contractAddress'> = {
  id: 'RSAL',
  type: TokenType.FA2,
  name: 'Red Salsa',
  shortName: 'RSAL',
  decimals: 0,
  symbol: 'RSAL',
  targetSymbol: 'RSAL',
  unit: 'RSAL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 55
};

export const sdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'sDAO',
  type: TokenType.FA2,
  name: 'Salsa DAO',
  shortName: 'sDAO',
  decimals: 0,
  symbol: 'sDAO',
  targetSymbol: 'sDAO',
  unit: 'sDAO',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 56
};

export const btctzToken: Omit<Token, 'contractAddress'> = {
  id: 'BTCtz',
  type: TokenType.FA2,
  name: 'BTCtez',
  shortName: 'BTCtz',
  decimals: 8,
  symbol: 'BTCtz',
  targetSymbol: 'BTCtz',
  unit: 'BTCtz',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 57
};

export const mtriaToken: Omit<Token, 'contractAddress'> = {
  id: 'MTRIA',
  type: TokenType.FA2,
  name: 'Materia',
  shortName: 'MTRIA',
  decimals: 6,
  symbol: 'MTRIA',
  targetSymbol: 'MTRIA',
  unit: 'MTRIA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 58
};

export const demnToken: Omit<Token, 'contractAddress'> = {
  id: 'DeMN',
  type: TokenType.FA2,
  name: 'DeMN',
  shortName: 'DeMN',
  decimals: 8,
  symbol: 'DeMN',
  targetSymbol: 'DeMN',
  unit: 'DeMN',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 59
};

export const minToken: Omit<Token, 'contractAddress'> = {
  id: 'MIN',
  type: TokenType.FA2,
  name: 'Tezotopia Minerals',
  shortName: 'MIN',
  decimals: 9,
  symbol: 'MIN',
  targetSymbol: 'MIN',
  unit: 'MIN',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 60
};

export const enrToken: Omit<Token, 'contractAddress'> = {
  id: 'ENR',
  type: TokenType.FA2,
  name: 'Tezotopia Energy',
  shortName: 'ENR',
  decimals: 9,
  symbol: 'ENR',
  targetSymbol: 'ENR',
  unit: 'ENR',
  impliedPrice: 1,
  tokenId: 2,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 61
};

export const mchToken: Omit<Token, 'contractAddress'> = {
  id: 'MCH',
  type: TokenType.FA2,
  name: 'Tezotopia Machinery',
  shortName: 'MCH',
  decimals: 9,
  symbol: 'MCH',
  targetSymbol: 'MCH',
  unit: 'MCH',
  impliedPrice: 1,
  tokenId: 3,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 62
};

export const upToken: Omit<Token, 'contractAddress'> = {
  id: 'UP',
  type: TokenType.FA1p2,
  name: 'Upsorber',
  shortName: 'UP',
  decimals: 0,
  symbol: 'UP',
  targetSymbol: 'UP',
  unit: 'UP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 63
};

export const abrToken: Omit<Token, 'contractAddress'> = {
  id: 'ABR',
  type: TokenType.FA2,
  name: 'Allbridge',
  shortName: 'ABR',
  decimals: 6,
  symbol: 'ABR',
  targetSymbol: 'ABR',
  unit: 'ABR',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 64
};

export const abbusdToken: Omit<Token, 'contractAddress'> = {
  id: 'abBUSD',
  type: TokenType.FA2,
  name: 'Allbridge Wrapped BUSD',
  shortName: 'abBUSD',
  decimals: 6,
  symbol: 'abBUSD',
  targetSymbol: 'abBUSD',
  unit: 'abBUSD',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 65
};

export const apusdcToken: Omit<Token, 'contractAddress'> = {
  id: 'apUSDC',
  type: TokenType.FA2,
  name: 'Allbridge Wrapped Polygon USDC',
  shortName: 'apUSDC',
  decimals: 6,
  symbol: 'apUSDC',
  targetSymbol: 'apUSDC',
  unit: 'apUSDC',
  impliedPrice: 1,
  tokenId: 2,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 66
};

export const wethpToken: Omit<Token, 'contractAddress'> = {
  id: 'WETH.p',
  type: TokenType.FA2,
  name: 'Polygon WETH',
  shortName: 'WETH.p',
  decimals: 18,
  symbol: 'WETH.p',
  targetSymbol: 'WETH.p',
  unit: 'WETH.p',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 67
};

export const wmaticpToken: Omit<Token, 'contractAddress'> = {
  id: 'WMATIC.p',
  type: TokenType.FA2,
  name: 'Polygon WMATIC',
  shortName: 'WMATIC.p',
  decimals: 18,
  symbol: 'WMATIC.p',
  targetSymbol: 'WMATIC.p',
  unit: 'WMATIC.p',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 68
};

export const tchickenToken: Omit<Token, 'contractAddress'> = {
  id: 'tChicken',
  type: TokenType.FA2,
  name: 'tChicken',
  shortName: 'tChicken',
  decimals: 6,
  symbol: 'tChicken',
  targetSymbol: 'tChicken',
  unit: 'tChicken',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 69
};

export const natasToken: Omit<Token, 'contractAddress'> = {
  id: 'NATAS',
  type: TokenType.FA2,
  name: 'NATAS',
  shortName: 'NATAS',
  decimals: 0,
  symbol: 'NATAS',
  targetSymbol: 'NATAS',
  unit: 'NATAS',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 70
};

export const wtacoToken: Omit<Token, 'contractAddress'> = {
  id: 'wTaco',
  type: TokenType.FA2,
  name: 'Wrapped Taco',
  shortName: 'wTaco',
  decimals: 0,
  symbol: 'wTaco',
  targetSymbol: 'wTaco',
  unit: 'wTaco',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 71
};

export const _3PToken: Omit<Token, 'contractAddress'> = {
  id: '3P',
  type: TokenType.FA2,
  name: '3P',
  shortName: '3P',
  decimals: 6,
  symbol: '3P',
  targetSymbol: '3P',
  unit: '3P',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 72
};

export const tcoinToken: Omit<Token, 'contractAddress'> = {
  id: 'TCOIN',
  type: TokenType.FA1p2,
  name: 'Trooperz Game TCOIN',
  shortName: 'TCOIN',
  decimals: 8,
  symbol: 'TCOIN',
  targetSymbol: 'TCOIN',
  unit: 'TCOIN',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 73
};

export const gsalToken: Omit<Token, 'contractAddress'> = {
  id: 'GSAL',
  type: TokenType.FA2,
  name: 'Green Salsa',
  shortName: 'GSAL',
  decimals: 8,
  symbol: 'GSAL',
  targetSymbol: 'GSAL',
  unit: 'GSAL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 74
};

export const scasToken: Omit<Token, 'contractAddress'> = {
  id: 'sCAS',
  type: TokenType.FA2,
  name: 'sCasino Shares',
  shortName: 'sCAS',
  decimals: 0,
  symbol: 'sCAS',
  targetSymbol: 'sCAS',
  unit: 'sCAS',
  impliedPrice: 1,
  tokenId: 1,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 75
};

export const crnchyToken: Omit<Token, 'contractAddress'> = {
  id: 'CRNCHY',
  type: TokenType.FA2,
  name: 'CRNCHY (Crunchy.Network DAO Token)',
  shortName: 'CRNCHY',
  decimals: 8,
  symbol: 'CRNCHY',
  targetSymbol: 'CRNCHY',
  unit: 'CRNCHY',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 76
};

export const plyToken: Omit<Token, 'contractAddress'> = {
  id: 'PLY',
  type: TokenType.FA1p2,
  name: 'PLY',
  shortName: 'PLY',
  decimals: 18,
  symbol: 'PLY',
  targetSymbol: 'PLY',
  unit: 'PLY',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 77
};

export const wcroToken: Omit<Token, 'contractAddress'> = {
  id: 'wCRO',
  type: TokenType.FA2,
  name: 'Wrapped CRO',
  shortName: 'wCRO',
  decimals: 8,
  symbol: 'wCRO',
  targetSymbol: 'wCRO',
  unit: 'wCRO',
  impliedPrice: 1,
  tokenId: 4,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 78
};

export const wsushiToken: Omit<Token, 'contractAddress'> = {
  id: 'wSUSHI',
  type: TokenType.FA2,
  name: 'Wrapped SUSHI',
  shortName: 'wSUSHI',
  decimals: 18,
  symbol: 'wSUSHI',
  targetSymbol: 'wSUSHI',
  unit: 'wSUSHI',
  impliedPrice: 1,
  tokenId: 15,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 79
};

export const wfttToken: Omit<Token, 'contractAddress'> = {
  id: 'wFTT',
  type: TokenType.FA2,
  name: 'Wrapped FTT',
  shortName: 'wFTT',
  decimals: 18,
  symbol: 'wFTT',
  targetSymbol: 'wFTT',
  unit: 'wFTT',
  impliedPrice: 1,
  tokenId: 6,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 80
};

export const skullToken: Omit<Token, 'contractAddress'> = {
  id: 'SKULL',
  type: TokenType.FA2,
  name: 'Skull',
  shortName: 'SKULL',
  decimals: 3,
  symbol: 'SKULL',
  targetSymbol: 'SKULL',
  unit: 'SKULL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 81
};

export const stvToken: Omit<Token, 'contractAddress'> = {
  id: 'STV',
  type: TokenType.FA2,
  name: 'STV',
  shortName: 'STV',
  decimals: 8,
  symbol: 'STV',
  targetSymbol: 'STV',
  unit: 'STV',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 82
};

export const rtqlaToken: Omit<Token, 'contractAddress'> = {
  id: 'RTQLA',
  type: TokenType.FA2,
  name: 'Tezos Reposado Tequila',
  shortName: 'RTQLA',
  decimals: 6,
  symbol: 'RTQLA',
  targetSymbol: 'RTQLA',
  unit: 'RTQLA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 83
};

export const shlToken: Omit<Token, 'contractAddress'> = {
  id: 'SHL',
  type: TokenType.FA1p2,
  name: 'Shells',
  shortName: 'SHL',
  decimals: 6,
  symbol: 'SHL',
  targetSymbol: 'SHL',
  unit: 'SHL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 84
};

export const wheatToken: Omit<Token, 'contractAddress'> = {
  id: 'WHEAT',
  type: TokenType.FA2,
  name: 'Wheat',
  shortName: 'WHEAT',
  decimals: 6,
  symbol: 'WHEAT',
  targetSymbol: 'WHEAT',
  unit: 'WHEAT',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 85
};

export const akadaoToken: Omit<Token, 'contractAddress'> = {
  id: 'akaDAO',
  type: TokenType.FA2,
  name: 'akaSwap DAO',
  shortName: 'akaDAO',
  decimals: 6,
  symbol: 'akaDAO',
  targetSymbol: 'akaDAO',
  unit: 'akaDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 86
};

export const idzToken: Omit<Token, 'contractAddress'> = {
  id: 'IDZ',
  type: TokenType.FA2,
  name: 'TezID',
  shortName: 'IDZ',
  decimals: 8,
  symbol: 'IDZ',
  targetSymbol: 'IDZ',
  unit: 'IDZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 87
};

export const gotToken: Omit<Token, 'contractAddress'> = {
  id: 'GOT',
  type: TokenType.FA2,
  name: 'GOeureka',
  shortName: 'GOT',
  decimals: 8,
  symbol: 'GOT',
  targetSymbol: 'GOT',
  unit: 'GOT',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 88
};

export const elxrToken: Omit<Token, 'contractAddress'> = {
  id: 'ELXR',
  type: TokenType.FA2,
  name: 'Elixir',
  shortName: 'ELXR',
  decimals: 9,
  symbol: 'ELXR',
  targetSymbol: 'ELXR',
  unit: 'ELXR',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 89
};

export const weedToken: Omit<Token, 'contractAddress'> = {
  id: 'WEED',
  type: TokenType.FA2,
  name: 'Weed',
  shortName: 'WEED',
  decimals: 8,
  symbol: 'WEED',
  targetSymbol: 'WEED',
  unit: 'WEED',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 90
};

export const evilToken: Omit<Token, 'contractAddress'> = {
  id: 'EVIL',
  type: TokenType.FA2,
  name: 'Evil Coin',
  shortName: 'EVIL',
  decimals: 4,
  symbol: 'EVIL',
  targetSymbol: 'EVIL',
  unit: 'EVIL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 91
};

export const bartToken: Omit<Token, 'contractAddress'> = {
  id: 'BART',
  type: TokenType.FA2,
  name: 'BullishArt Token',
  shortName: 'BART',
  decimals: 9,
  symbol: 'BART',
  targetSymbol: 'BART',
  unit: 'BART',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 92
};

export const radioToken: Omit<Token, 'contractAddress'> = {
  id: 'RADIO',
  type: TokenType.FA2,
  name: 'RADION FM',
  shortName: 'RADIO',
  decimals: 6,
  symbol: 'RADIO',
  targetSymbol: 'RADIO',
  unit: 'RADIO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 93
};

export const gutsToken: Omit<Token, 'contractAddress'> = {
  id: 'GUTS',
  type: TokenType.FA2,
  name: 'Guts Gaming',
  shortName: 'GUTS',
  decimals: 0,
  symbol: 'GUTS',
  targetSymbol: 'GUTS',
  unit: 'GUTS',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 94
};

export const banToken: Omit<Token, 'contractAddress'> = {
  id: 'BAN',
  type: TokenType.FA2,
  name: 'Banana',
  shortName: 'BAN',
  decimals: 2,
  symbol: 'BAN',
  targetSymbol: 'BAN',
  unit: 'BAN',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 95
};

export const tdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'tDAO',
  type: TokenType.FA2,
  name: 'Taco DAO',
  shortName: 'tDAO',
  decimals: 4,
  symbol: 'tDAO',
  targetSymbol: 'tDAO',
  unit: 'tDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 96
};

export const shtzToken: Omit<Token, 'contractAddress'> = {
  id: 'SHTz',
  type: TokenType.FA2,
  name: 'Shitz',
  shortName: 'SHTz',
  decimals: 2,
  symbol: 'SHTz',
  targetSymbol: 'SHTz',
  unit: 'SHTz',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 97
};

export const dripToken: Omit<Token, 'contractAddress'> = {
  id: 'DRIP',
  type: TokenType.FA2,
  name: 'Aether Drip',
  shortName: 'DRIP',
  decimals: 8,
  symbol: 'DRIP',
  targetSymbol: 'DRIP',
  unit: 'DRIP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 98
};

export const bezosToken: Omit<Token, 'contractAddress'> = {
  id: 'Bezos',
  type: TokenType.FA2,
  name: 'Tezos Till We Bezos',
  shortName: 'Bezos',
  decimals: 0,
  symbol: 'Bezos',
  targetSymbol: 'Bezos',
  unit: 'Bezos',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 99
};

export const rcktToken: Omit<Token, 'contractAddress'> = {
  id: 'RCKT',
  type: TokenType.FA2,
  name: 'Rocket',
  shortName: 'RCKT',
  decimals: 6,
  symbol: 'RCKT',
  targetSymbol: 'RCKT',
  unit: 'RCKT',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 100
};

export const bdvxpToken: Omit<Token, 'contractAddress'> = {
  id: 'BDVXP',
  type: TokenType.FA2,
  name: 'BohnerDyldoh VX Pro',
  shortName: 'BDVXP',
  decimals: 6,
  symbol: 'BDVXP',
  targetSymbol: 'BDVXP',
  unit: 'BDVXP',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 101
};

export const bdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'bDAO',
  type: TokenType.FA2,
  name: 'Bazaar DAO',
  shortName: 'bDAO',
  decimals: 6,
  symbol: 'bDAO',
  targetSymbol: 'bDAO',
  unit: 'bDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 102
};

export const hrdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'hrDAO',
  type: TokenType.FA2,
  name: 'Hera Network DAO Token',
  shortName: 'hrDAO',
  decimals: 6,
  symbol: 'hrDAO',
  targetSymbol: 'hrDAO',
  unit: 'hrDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 103
};

export const ecnToken: Omit<Token, 'contractAddress'> = {
  id: 'ECN',
  type: TokenType.FA2,
  name: 'ECOIN NETWORK',
  shortName: 'ECN',
  decimals: 8,
  symbol: 'ECN',
  targetSymbol: 'ECN',
  unit: 'ECN',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 104
};

export const purpleToken: Omit<Token, 'contractAddress'> = {
  id: 'PURPLE',
  type: TokenType.FA1p2,
  name: 'Eggplant',
  shortName: 'PURPLE',
  decimals: 6,
  symbol: 'PURPLE',
  targetSymbol: 'PURPLE',
  unit: 'PURPLE',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 105
};

export const cloverToken: Omit<Token, 'contractAddress'> = {
  id: 'CLOVER',
  type: TokenType.FA1p2,
  name: 'Four Leaf Clover',
  shortName: 'CLOVER',
  decimals: 6,
  symbol: 'CLOVER',
  targetSymbol: 'CLOVER',
  unit: 'CLOVER',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 106
};

export const oxtzToken: Omit<Token, 'contractAddress'> = {
  id: 'oXTZ',
  type: TokenType.FA1p2,
  name: 'objkt.com wrapped Tezos',
  shortName: 'oXTZ',
  decimals: 6,
  symbol: 'oXTZ',
  targetSymbol: 'oXTZ',
  unit: 'oXTZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 107
};

export const gonzToken: Omit<Token, 'contractAddress'> = {
  id: 'GONZ',
  type: TokenType.FA2,
  name: 'DoctaGonz',
  shortName: 'GONZ',
  decimals: 6,
  symbol: 'GONZ',
  targetSymbol: 'GONZ',
  unit: 'GONZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 108
};

export const heraToken: Omit<Token, 'contractAddress'> = {
  id: 'HERA',
  type: TokenType.FA2,
  name: 'Hera Network Token',
  shortName: 'HERA',
  decimals: 3,
  symbol: 'HERA',
  targetSymbol: 'HERA',
  unit: 'HERA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 109
};

export const platToken: Omit<Token, 'contractAddress'> = {
  id: 'PLAT',
  type: TokenType.FA2,
  name: 'Tezos Platinum Tequila',
  shortName: 'PLAT',
  decimals: 6,
  symbol: 'PLAT',
  targetSymbol: 'PLAT',
  unit: 'PLAT',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 110
};

export const fdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'fDAO',
  type: TokenType.FA2,
  name: 'fDAO',
  shortName: 'fDAO',
  decimals: 6,
  symbol: 'fDAO',
  targetSymbol: 'fDAO',
  unit: 'fDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 111
};

export const tezdaoToken: Omit<Token, 'contractAddress'> = {
  id: 'TezDAO',
  type: TokenType.FA2,
  name: 'TezDAO',
  shortName: 'TezDAO',
  decimals: 6,
  symbol: 'TezDAO',
  targetSymbol: 'TezDAO',
  unit: 'TezDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 112
};

export const cvzaToken: Omit<Token, 'contractAddress'> = {
  id: 'CVZA',
  type: TokenType.FA2,
  name: 'Cerveza',
  shortName: 'CVZA',
  decimals: 8,
  symbol: 'CVZA',
  targetSymbol: 'CVZA',
  unit: 'CVZA',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 113
};

export const pxldaoToken: Omit<Token, 'contractAddress'> = {
  id: 'pxlDAO',
  type: TokenType.FA2,
  name: 'Pixel DAO',
  shortName: 'pxlDAO',
  decimals: 6,
  symbol: 'pxlDAO',
  targetSymbol: 'pxlDAO',
  unit: 'pxlDAO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 114
};

export const sebToken: Omit<Token, 'contractAddress'> = {
  id: 'SEB',
  type: TokenType.FA2,
  name: 'Sebuh.net ',
  shortName: 'SEB',
  decimals: 2,
  symbol: 'SEB',
  targetSymbol: 'SEB',
  unit: 'SEB',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 115
};

export const aqrtzToken: Omit<Token, 'contractAddress'> = {
  id: 'AQRtz',
  type: TokenType.FA2,
  name: 'Aqar Tezos Token',
  shortName: 'AQRtz',
  decimals: 14,
  symbol: 'AQRtz',
  targetSymbol: 'AQRtz',
  unit: 'AQRtz',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 116
};

export const tzdToken: Omit<Token, 'contractAddress'> = {
  id: 'TZD',
  type: TokenType.FA2,
  name: 'Tezard Coin',
  shortName: 'TZD',
  decimals: 8,
  symbol: 'TZD',
  targetSymbol: 'TZD',
  unit: 'TZD',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 117
};

export const easyToken: Omit<Token, 'contractAddress'> = {
  id: 'EASY',
  type: TokenType.FA2,
  name: 'CryptoEasy',
  shortName: 'EASY',
  decimals: 6,
  symbol: 'EASY',
  targetSymbol: 'EASY',
  unit: 'EASY',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 118
};

export const soilToken: Omit<Token, 'contractAddress'> = {
  id: 'SOIL',
  type: TokenType.FA2,
  name: 'Soil',
  shortName: 'SOIL',
  decimals: 4,
  symbol: 'SOIL',
  targetSymbol: 'SOIL',
  unit: 'SOIL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 119
};

export const myhToken: Omit<Token, 'contractAddress'> = {
  id: 'MYH',
  type: TokenType.FA2,
  name: 'MoneyHero',
  shortName: 'MYH',
  decimals: 8,
  symbol: 'MYH',
  targetSymbol: 'MYH',
  unit: 'MYH',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 120
};

export const hehToken: Omit<Token, 'contractAddress'> = {
  id: 'HEH',
  type: TokenType.FA1p2,
  name: 'Hedgehoge',
  shortName: 'HEH',
  decimals: 6,
  symbol: 'HEH',
  targetSymbol: 'HEH',
  unit: 'HEH',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 121
};

export const magToken: Omit<Token, 'contractAddress'> = {
  id: 'MAG',
  type: TokenType.FA1p2,
  name: 'MAG Token',
  shortName: 'MAG',
  decimals: 6,
  symbol: 'MAG',
  targetSymbol: 'MAG',
  unit: 'MAG',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 122
};

export const szoToken: Omit<Token, 'contractAddress'> = {
  id: 'SZO',
  type: TokenType.FA1p2,
  name: 'ShuttleOne Token',
  shortName: 'SZO',
  decimals: 6,
  symbol: 'SZO',
  targetSymbol: 'SZO',
  unit: 'SZO',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 123
};

export const stkrToken: Omit<Token, 'contractAddress'> = {
  id: 'STKR',
  type: TokenType.FA1p2,
  name: 'STKR',
  shortName: 'STKR',
  decimals: 18,
  symbol: 'STKR',
  targetSymbol: 'STKR',
  unit: 'STKR',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 124
};

export const wtezToken: Omit<Token, 'contractAddress'> = {
  id: 'wTEZ',
  type: TokenType.FA2,
  name: 'Wrapped Tezos FA2 token',
  shortName: 'wTEZ',
  decimals: 6,
  symbol: 'wTEZ',
  targetSymbol: 'wTEZ',
  unit: 'wTEZ',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 126
};

export const tkeyToken: Omit<Token, 'contractAddress'> = {
  id: 'TKEY',
  type: TokenType.FA2,
  name: 'Temple Key',
  shortName: 'TKEY',
  decimals: 18,
  symbol: 'TKEY',
  targetSymbol: 'TKEY',
  unit: 'TKEY',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 128
};

export const pepe_kt_61aToken: Omit<Token, 'contractAddress'> = {
  id: 'PEPE_KT_61a',
  type: TokenType.FA2,
  name: 'Pepe KT 61a',
  shortName: 'PEPE',
  decimals: 1,
  symbol: 'PEPE',
  targetSymbol: 'PEPE',
  unit: 'PEPE',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 129
};

export const pepeToken: Omit<Token, 'contractAddress'> = {
  id: 'PEPE',
  type: TokenType.FA2,
  name: 'Tezos Pepe',
  shortName: 'PEPE',
  decimals: 2,
  symbol: 'PEPE',
  targetSymbol: 'PEPE',
  unit: 'PEPE',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 130
};

export const trollToken: Omit<Token, 'contractAddress'> = {
  id: 'TROLL',
  type: TokenType.FA2,
  name: 'TROLL',
  shortName: 'TROLL',
  decimals: 0,
  symbol: 'TROLL',
  targetSymbol: 'TROLL',
  unit: 'TROLL',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 131
};

export const tokensToken: Omit<Token, 'contractAddress'> = {
  id: 'TOKENS',
  type: TokenType.FA2,
  name: 'Tokens',
  shortName: 'TOKENS',
  decimals: 2,
  symbol: 'TOKENS',
  targetSymbol: 'TOKENS',
  unit: 'TOKENS',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 132
};

export const lyziToken: Omit<Token, 'contractAddress'> = {
  id: 'LYZI',
  type: TokenType.FA2,
  name: 'Lyzi',
  shortName: 'LYZI',
  decimals: 6,
  symbol: 'LYZI',
  targetSymbol: 'LYZI',
  unit: 'LYZI',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 133
};
