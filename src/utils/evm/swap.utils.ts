import { BigNumber } from 'bignumber.js';
import { encodeFunctionData, erc20Abi, isAddress, zeroAddress } from 'viem';

import {
  parse3RouteEvmRoute,
  Route3EvmRoute,
  Route3EvmRouteRequest,
  Route3EvmTokenWithPrice
} from 'src/apis/temple-wallet/evm-swap';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { ROUTING_FEE_EVM_ADDRESS, ROUTING_FEE_RATIO } from 'src/config/swap';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapAsset, EvmSwapQuote, EvmSwapQuoteIdentity } from 'src/types/evm-swap';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export const EVM_SWAP_QUOTE_LIFETIME = 60_000;

const toSwapAssetSlug = (address: string): string =>
  address.toLowerCase() === zeroAddress ? EVM_TOKEN_SLUG : toEvmAssetSlug(address);

const toSwapProxyAddress = (slug: string): HexString => {
  if (slug === EVM_TOKEN_SLUG) return zeroAddress;
  const address = toEvmAssetSlug(slug);
  if (!isAddress(address)) throw new Error('Invalid Etherlink token address.');

  return address;
};

export const buildEvmSwapCatalog = (
  tokens: Record<string, Route3EvmTokenWithPrice>,
  balances: Record<string, string>,
  assets: EvmChainAssetsRecord,
  metadata: Record<string, EvmStoredTokenMetadata>,
  fiatToUsdRate?: number
): EvmSwapAsset[] => {
  const result = new Map<string, EvmSwapAsset>();
  for (const token of Object.values(tokens)) {
    const assetSlug = toSwapAssetSlug(token.address);
    const owned = assets[assetSlug];
    if (owned && owned.standard !== EvmAssetStandardEnum.NATIVE && owned.standard !== EvmAssetStandardEnum.ERC20)
      continue;
    const manualMetadata = owned?.manual ? metadata[assetSlug] : undefined;
    const isNative = assetSlug === EVM_TOKEN_SLUG;
    const currency = ETHERLINK_MAINNET_CHAIN_SPECS.currency;
    const price = token.priceUSD === undefined ? undefined : new BigNumber(token.priceUSD);
    const common = {
      chainKind: TempleChainKind.EVM,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      assetSlug,
      assetKey: toChainAssetSlug({ chainKind: TempleChainKind.EVM, chainId: ETHERLINK_MAINNET_CHAIN_ID }, assetSlug),
      networkName: 'Etherlink',
      decimals: isNative ? currency.decimals : manualMetadata?.decimals ?? token.decimals,
      symbol: isNative ? currency.symbol : manualMetadata?.symbol ?? token.symbol,
      name: isNative ? currency.name : manualMetadata?.name ?? token.name,
      iconName: isNative ? CryptoLogoNameEnum.Etherlink : undefined,
      thumbnailUri: metadata[assetSlug]?.iconURL?.trim() || token.logoURI?.trim() || undefined,
      balance: balances[assetSlug] ?? '0',
      exchangeRate:
        price?.gt(0) && fiatToUsdRate !== undefined && Number.isFinite(price.toNumber())
          ? price.multipliedBy(fiatToUsdRate).toNumber()
          : undefined
    };
    const asset: EvmSwapAsset = isNative
      ? { ...common, chainKind: TempleChainKind.EVM, assetSlug: EVM_TOKEN_SLUG, standard: EvmAssetStandardEnum.NATIVE }
      : {
          ...common,
          chainKind: TempleChainKind.EVM,
          standard: EvmAssetStandardEnum.ERC20,
          contractAddress: toSwapProxyAddress(assetSlug)
        };
    result.set(assetSlug, asset);
  }

  return [...result.values()];
};

const EVM_SWAP_FEE_PERCENT = new BigNumber(ROUTING_FEE_RATIO).multipliedBy(100).toFixed();

export const createEvmSwapIdentity = (
  fromAddress: HexString,
  input: EvmSwapAsset,
  output: EvmSwapAsset,
  amount: BigNumber,
  slippage: number
): EvmSwapQuoteIdentity => {
  if (
    input.chainId !== ETHERLINK_MAINNET_CHAIN_ID ||
    output.chainId !== input.chainId ||
    input.assetSlug === output.assetSlug ||
    !amount.isInteger() ||
    !amount.gt(0) ||
    !amount.isFinite() ||
    amount.gte(new BigNumber(2).pow(256)) ||
    !Number.isFinite(slippage) ||
    slippage < 0 ||
    slippage > 30
  )
    throw new Error('Invalid Etherlink swap pair or amount.');
  const normalizedFrom = fromAddress.toLowerCase();
  const referrer = ROUTING_FEE_EVM_ADDRESS.toLowerCase();
  if (!isAddress(normalizedFrom) || normalizedFrom === zeroAddress || !isAddress(referrer))
    throw new Error('Invalid swap account.');

  return {
    chainId: input.chainId,
    fromAddress: normalizedFrom,
    src: toSwapProxyAddress(input.assetSlug),
    dst: toSwapProxyAddress(output.assetSlug),
    amount: amount.toFixed(0),
    slippage: new BigNumber(slippage).toFixed(),
    referrer,
    fee: EVM_SWAP_FEE_PERCENT
  };
};

export const swapIdentityKey = (identity?: EvmSwapQuoteIdentity): string => (identity ? JSON.stringify(identity) : '');
export const toSwapRouteRequest = (identity: EvmSwapQuoteIdentity): Route3EvmRouteRequest => ({
  src: identity.src,
  dst: identity.dst,
  amount: identity.amount,
  from: identity.fromAddress,
  slippage: identity.slippage,
  referrer: identity.referrer,
  fee: identity.fee
});

export const validateSwapRouteIdentity = (route: Route3EvmRoute, identity: EvmSwapQuoteIdentity): void => {
  if (
    identity.chainId !== ETHERLINK_MAINNET_CHAIN_ID ||
    route.fromAddress.toLowerCase() !== identity.fromAddress.toLowerCase() ||
    route.fromToken.address.toLowerCase() !== identity.src.toLowerCase() ||
    route.toToken.address.toLowerCase() !== identity.dst.toLowerCase() ||
    route.fromAmount !== identity.amount
  )
    throw new Error('The route does not match the selected account, pair, or amount.');
};

export const validateSwapAssets = (quote: EvmSwapQuote, input: EvmSwapAsset, output: EvmSwapAsset): void => {
  parse3RouteEvmRoute(quote.route);
  validateSwapRouteIdentity(quote.route, quote.identity);
  if (
    input.chainKind !== TempleChainKind.EVM ||
    output.chainKind !== TempleChainKind.EVM ||
    (input.standard === EvmAssetStandardEnum.ERC20 && input.contractAddress.toLowerCase() !== quote.identity.src) ||
    (output.standard === EvmAssetStandardEnum.ERC20 && output.contractAddress.toLowerCase() !== quote.identity.dst) ||
    input.chainId !== quote.identity.chainId ||
    output.chainId !== quote.identity.chainId ||
    toSwapProxyAddress(input.assetSlug) !== quote.identity.src ||
    toSwapProxyAddress(output.assetSlug) !== quote.identity.dst ||
    input.decimals !== quote.route.fromToken.decimals ||
    output.decimals !== quote.route.toToken.decimals ||
    (input.standard === EvmAssetStandardEnum.NATIVE) !== (quote.identity.src === zeroAddress) ||
    (output.standard === EvmAssetStandardEnum.NATIVE) !== (quote.identity.dst === zeroAddress)
  )
    throw new Error('The route token metadata does not match the selected assets.');
};

// The Temple proxy controls the approval spender and the router calldata.
export const buildEvmSwapRequest = (
  quote: EvmSwapQuote,
  input: EvmSwapAsset,
  output: EvmSwapAsset
): EvmTransactionRequest => {
  validateSwapAssets(quote, input, output);

  return {
    to: quote.route.txDestination,
    data: quote.route.txData,
    value: input.standard === EvmAssetStandardEnum.NATIVE ? BigInt(quote.route.fromAmount) : 0n,
    gas: BigInt(quote.route.gas)
  };
};

export const buildEvmSwapApproval = (quote: EvmSwapQuote, input: EvmSwapAsset): EvmTransactionRequest => {
  if (
    input.standard !== EvmAssetStandardEnum.ERC20 ||
    toSwapProxyAddress(input.assetSlug) !== quote.identity.src ||
    input.contractAddress.toLowerCase() !== quote.identity.src
  ) {
    throw new Error('Only the source ERC20 token can receive approval.');
  }

  return {
    to: input.contractAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [quote.route.txDestination, BigInt(quote.route.fromAmount)]
    })
  };
};

export const isSwapQuoteFresh = (quote: EvmSwapQuote, now = Date.now()): boolean =>
  now >= quote.receivedAt && now - quote.receivedAt < EVM_SWAP_QUOTE_LIFETIME;

export const assertSwapBalances = (
  request: EvmTransactionRequest,
  gasLimit: bigint,
  feeCap: bigint,
  nativeBalance: bigint,
  sourceAmount: bigint,
  tokenBalance?: bigint
): void => {
  if (nativeBalance < request.value + gasLimit * feeCap)
    throw new Error('Insufficient XTZ for the amount and network fee.');
  if (tokenBalance !== undefined && tokenBalance < sourceAmount) throw new Error('Insufficient source token balance.');
};
