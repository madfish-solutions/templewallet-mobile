import { BigNumber } from 'bignumber.js';
import { maxUint256, zeroAddress } from 'viem';
import { number, object, SchemaOf, string } from 'yup';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { bigNumberSchema } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapQuoteIdentity } from 'src/types/evm-swap';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { evmAddressValidationSchema } from './utils';

const MAX_SWAP_AMOUNT = maxUint256.toString();

interface SwapToken {
  assetSlug: string;
  standard: string;
  contractAddress?: string;
}

interface SwapAsset extends SwapToken {
  chainKind: string;
  chainId: number;
  decimals: number;
}

interface SwapRoute {
  fromAddress: string;
  fromAmount: string;
  fromToken: { address: string };
  toToken: { address: string };
}

export const evmSwapAmountValidationSchema = bigNumberSchema()
  .required(makeRequiredErrorMessage('Amount'))
  .test(
    'valid-swap-amount',
    'Enter a valid amount',
    value =>
      value instanceof BigNumber && value.isFinite() && value.isInteger() && value.gt(0) && value.lte(MAX_SWAP_AMOUNT)
  );

const swapPairAssetSchema = object({
  chainId: number().oneOf([ETHERLINK_MAINNET_CHAIN_ID]).required(),
  assetSlug: string().required()
}).required();

export const evmSwapParametersValidationSchema = object({
  input: swapPairAssetSchema,
  output: swapPairAssetSchema,
  amount: evmSwapAmountValidationSchema,
  slippage: number().min(0).max(30).required()
})
  .test('different-assets', 'Select a different token', value => value?.input?.assetSlug !== value?.output?.assetSlug)
  .required();

const evmSwapAccountValidationSchema = object({
  fromAddress: evmAddressValidationSchema().notOneOf([zeroAddress]).required(),
  referrer: evmAddressValidationSchema().required()
}).required();

interface SwapAccount {
  fromAddress: string;
  referrer: string;
}

export const isValidEvmSwapAccount = (
  account: SwapAccount
): account is Pick<EvmSwapQuoteIdentity, 'fromAddress' | 'referrer'> =>
  evmSwapAccountValidationSchema.isValidSync(account, { strict: true });

const matchingAddressSchema = (address: HexString): SchemaOf<string> =>
  string()
    .test(
      'matches-address',
      'The address does not match the quote.',
      value => value?.toLowerCase() === address.toLowerCase()
    )
    .required();

export const createEvmSwapRouteValidationSchema = (identity: EvmSwapQuoteIdentity): SchemaOf<SwapRoute> =>
  object({
    fromAddress: matchingAddressSchema(identity.fromAddress),
    fromToken: object({ address: matchingAddressSchema(identity.src) }).required(),
    toToken: object({ address: matchingAddressSchema(identity.dst) }).required(),
    fromAmount: string().oneOf([identity.amount]).required()
  }).required();

const createSwapTokenValidationSchema = (address: HexString): SchemaOf<SwapToken> => {
  const isNative = address === zeroAddress;

  return object({
    assetSlug: isNative ? string().oneOf([EVM_TOKEN_SLUG]).required() : matchingAddressSchema(address),
    standard: string()
      .oneOf([isNative ? EvmAssetStandardEnum.NATIVE : EvmAssetStandardEnum.ERC20])
      .required(),
    contractAddress: isNative ? string() : matchingAddressSchema(address)
  }).required();
};

export const createEvmSwapAssetValidationSchema = (
  address: HexString,
  chainId: number,
  decimals: number
): SchemaOf<SwapAsset> =>
  createSwapTokenValidationSchema(address).shape({
    chainKind: string().oneOf([TempleChainKind.EVM]).required(),
    chainId: number().oneOf([chainId]).required(),
    decimals: number().oneOf([decimals]).required()
  });

export const createEvmSwapApprovalValidationSchema = (source: HexString): SchemaOf<SwapToken> =>
  createSwapTokenValidationSchema(source).shape({
    standard: string().oneOf([EvmAssetStandardEnum.ERC20]).required()
  });
