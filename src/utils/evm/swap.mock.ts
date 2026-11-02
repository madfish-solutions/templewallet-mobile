import { zeroAddress } from 'viem';

import { Route3EvmRoute, Route3EvmTokenWithPrice } from 'src/apis/temple-wallet/evm-swap';
import { ROUTING_FEE_EVM_ADDRESS } from 'src/config/swap';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapAsset, EvmSwapQuote } from 'src/types/evm-swap';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export const SWAP_OWNER: HexString = '0x0000000000000000000000000000000000000001';
export const SWAP_ROUTER: HexString = '0x0000000000000000000000000000000000000002';
export const SWAP_TOKEN_ADDRESS: HexString = '0x00000000000000000000000000000000000000ab';
export const SWAP_NATIVE_TOKEN: Route3EvmTokenWithPrice = {
  address: zeroAddress,
  name: 'Tezos',
  symbol: 'XTZ',
  decimals: 18,
  tags: ['native']
};
export const SWAP_ERC20_TOKEN: Route3EvmTokenWithPrice = {
  address: SWAP_TOKEN_ADDRESS,
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  tags: null
};
export const SWAP_ROUTE: Route3EvmRoute = {
  fromAmount: '1000000000000000000',
  fromAmountUSD: '1',
  toAmount: '1000000',
  toAmountUSD: '1',
  fromAddress: SWAP_OWNER,
  fromToken: SWAP_NATIVE_TOKEN,
  toToken: SWAP_ERC20_TOKEN,
  stepsCount: 2,
  txDestination: SWAP_ROUTER,
  txData: '0x12345678',
  gas: '100000',
  gasPrice: '10',
  toAmountMin: '997500'
};
export const SWAP_QUOTE: EvmSwapQuote = {
  identity: {
    chainId: ETHERLINK_MAINNET_CHAIN_ID,
    fromAddress: SWAP_OWNER,
    src: zeroAddress,
    dst: SWAP_TOKEN_ADDRESS,
    amount: SWAP_ROUTE.fromAmount,
    slippage: '0.25',
    referrer: ROUTING_FEE_EVM_ADDRESS.toLowerCase() as HexString,
    fee: '0.6'
  },
  route: SWAP_ROUTE,
  receivedAt: 0
};
export const SWAP_NATIVE_ASSET: EvmSwapAsset = {
  name: 'Tezos',
  symbol: 'XTZ',
  decimals: 18,
  balance: '2000000000000000000',
  chainKind: TempleChainKind.EVM,
  chainId: ETHERLINK_MAINNET_CHAIN_ID,
  assetSlug: EVM_TOKEN_SLUG,
  assetKey: 'evm:42793:eth',
  networkName: 'Etherlink',
  standard: EvmAssetStandardEnum.NATIVE
};
export const SWAP_ERC20_ASSET: EvmSwapAsset = {
  ...SWAP_NATIVE_ASSET,
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  balance: '2000000',
  assetSlug: SWAP_TOKEN_ADDRESS,
  assetKey: 'evm:42793:token',
  standard: EvmAssetStandardEnum.ERC20,
  contractAddress: SWAP_TOKEN_ADDRESS
};
export const SWAP_ERC20_QUOTE: EvmSwapQuote = {
  ...SWAP_QUOTE,
  identity: { ...SWAP_QUOTE.identity, src: SWAP_TOKEN_ADDRESS, dst: zeroAddress, amount: '1000000' },
  route: {
    ...SWAP_ROUTE,
    fromToken: SWAP_ERC20_TOKEN,
    toToken: SWAP_NATIVE_TOKEN,
    fromAmount: '1000000',
    toAmount: '1000000000000000000',
    toAmountMin: '990000000000000000'
  }
};
