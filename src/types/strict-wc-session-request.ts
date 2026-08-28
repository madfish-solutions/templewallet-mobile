import { WalletKitTypes } from '@reown/walletkit';
import { Address, TypedDataDefinition } from 'viem';

import { ValidatedWatchAssetParams } from 'src/utils/evm/validation-schemas/watch-asset';
import {
  EVM_WC_ACCOUNTS_METHODS,
  EVM_WC_EVENTS,
  EVM_WC_METHODS,
  EVM_WC_MODERN_TYPED_DATA_METHODS,
  EVM_WC_OLD_TYPED_DATA_METHODS,
  EVM_WC_SEND_TRANSACTION_METHODS,
  EVM_WC_SIGNING_METHODS,
  EVM_WC_WATCH_ASSET_METHODS
} from 'src/walletconnect/constants';

type EvmWcAccountsMethod = (typeof EVM_WC_ACCOUNTS_METHODS)[number];
type EvmWcOldTypedDataMethod = (typeof EVM_WC_OLD_TYPED_DATA_METHODS)[number];
type EvmWcModernTypedDataMethod = (typeof EVM_WC_MODERN_TYPED_DATA_METHODS)[number];
type EvmWcSigningMethod = (typeof EVM_WC_SIGNING_METHODS)[number];
type EvmWcSendTransactionMethod = (typeof EVM_WC_SEND_TRANSACTION_METHODS)[number];
type EvmWcWatchAssetMethod = (typeof EVM_WC_WATCH_ASSET_METHODS)[number];
type EvmWcEvent = (typeof EVM_WC_EVENTS)[number];

export const isWcOldTypedDataMethod = (method: string): method is EvmWcOldTypedDataMethod =>
  EVM_WC_OLD_TYPED_DATA_METHODS.some(typedDataMethod => typedDataMethod === method);

export const isWcModernTypedDataMethod = (method: string): method is EvmWcModernTypedDataMethod =>
  EVM_WC_MODERN_TYPED_DATA_METHODS.some(modernTypedDataMethod => modernTypedDataMethod === method);

export const isWcSigningMethod = (method: string): method is EvmWcSigningMethod =>
  EVM_WC_SIGNING_METHODS.some(signingMethod => signingMethod === method);

export const isWcAccountsMethod = (method: string): method is EvmWcAccountsMethod =>
  EVM_WC_ACCOUNTS_METHODS.some(accountsMethod => accountsMethod === method);

export const isWcSendTransactionMethod = (method: string): method is EvmWcSendTransactionMethod =>
  EVM_WC_SEND_TRANSACTION_METHODS.some(sendTransactionMethod => sendTransactionMethod === method);

export const isWcWatchAssetMethod = (method: string): method is EvmWcWatchAssetMethod =>
  EVM_WC_WATCH_ASSET_METHODS.some(watchAssetMethod => watchAssetMethod === method);

export const isSupportedWcMethod = (method: string): method is (typeof EVM_WC_METHODS)[number] =>
  EVM_WC_METHODS.some(supportedWcMethod => supportedWcMethod === method);

export const isSupportedWcEvent = (event: string): event is EvmWcEvent =>
  EVM_WC_EVENTS.some(wcEvent => wcEvent === event);

type StrictWcSessionRequestContentBase = WalletKitTypes.SessionRequest['params']['request'];

interface WcAccountsRequestContent extends StrictWcSessionRequestContentBase {
  method: EvmWcAccountsMethod;
}

export const isWcAccountsRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcAccountsRequestContent => {
  return isWcAccountsMethod(requestContent.method);
};

interface OldTypedDataField {
  name: string;
  type: string;
  value: unknown;
}

export type OldTypedData = OldTypedDataField[];

interface WcOldTypedDataRequestContent extends StrictWcSessionRequestContentBase {
  method: EvmWcOldTypedDataMethod;
  params: [OldTypedData, Address];
}

interface WcModernTypedDataRequestContent extends StrictWcSessionRequestContentBase {
  method: EvmWcModernTypedDataMethod;
  params: [Address, TypedDataDefinition];
}

export interface WcPersonalSignRequestContent extends StrictWcSessionRequestContentBase {
  method: 'personal_sign';
  params: [HexString, Address];
}

export interface ValidatedRpcAuthorization {
  address: HexString;
  chainId: HexString;
  nonce: HexString;
  r: HexString;
  s: HexString;
  yParity?: HexString;
  v?: HexString;
}

export interface ValidatedRpcTransactionRequest {
  from?: HexString;
  to?: HexString;
  data?: HexString;
  gas?: HexString;
  gasLimit?: HexString;
  nonce?: HexString;
  value?: HexString;
  gasPrice?: HexString;
  maxFeePerGas?: HexString;
  maxPriorityFeePerGas?: HexString;
  type?: '0x0' | '0x1' | '0x2' | '0x4';
  accessList?: { address: HexString; storageKeys: HexString[] }[];
  authorizationList?: ValidatedRpcAuthorization[];
}

export interface WcSendTransactionRequestContent extends StrictWcSessionRequestContentBase {
  method: EvmWcSendTransactionMethod;
  params: [ValidatedRpcTransactionRequest];
}

export const isWcSendTransactionRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcSendTransactionRequestContent => {
  return isWcSendTransactionMethod(requestContent.method);
};

export interface WcWatchAssetRequestContent extends StrictWcSessionRequestContentBase {
  method: EvmWcWatchAssetMethod;
  params: ValidatedWatchAssetParams;
}

export const isWcWatchAssetRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcWatchAssetRequestContent => {
  return isWcWatchAssetMethod(requestContent.method);
};

export type WcSignTypedDataRequestContent = WcOldTypedDataRequestContent | WcModernTypedDataRequestContent;

export type StrictWcSigningRequestContent = WcSignTypedDataRequestContent | WcPersonalSignRequestContent;

export const isWcPersonalSignRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcPersonalSignRequestContent => {
  return requestContent.method === 'personal_sign';
};

export const isWcOldTypedDataRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcOldTypedDataRequestContent => {
  return isWcOldTypedDataMethod(requestContent.method);
};

export const isWcModernTypedDataRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is WcModernTypedDataRequestContent => {
  return isWcModernTypedDataMethod(requestContent.method);
};

export const isStrictWcSigningRequestContent = (
  requestContent: StrictWcSessionRequestContent
): requestContent is StrictWcSigningRequestContent => {
  return (
    isWcPersonalSignRequestContent(requestContent) ||
    isWcOldTypedDataRequestContent(requestContent) ||
    isWcModernTypedDataRequestContent(requestContent)
  );
};

export type StrictWcSessionRequestContent =
  | WcAccountsRequestContent
  | StrictWcSigningRequestContent
  | WcSendTransactionRequestContent
  | WcWatchAssetRequestContent;

export interface StrictWcSessionRequest<Content = StrictWcSessionRequestContent> extends WalletKitTypes.SessionRequest {
  params: WalletKitTypes.SessionRequest['params'] & {
    request: Content;
  };
}
