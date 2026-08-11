import { AnyAction } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { getAddress, Hash, Hex, isAddressEqual, TypedDataDefinition } from 'viem';
import { LocalAccount } from 'viem/accounts';

import { Shelter } from 'src/shelter/shelter';
import { dispatch as defaultDispatch } from 'src/store';
import { setEvmAssetManualAction } from 'src/store/evm/assets/evm-assets-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { EvmAssetStandardEnum, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';
import { getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';
import { EvmTokenOnChainMetadata } from 'src/utils/evm/on-chain/types';
import {
  ParsedEvmRpcTransactionRequest,
  parseRpcTransactionRequest
} from 'src/utils/evm/parse-rpc-transaction-request';
import { typedV1SignatureHash } from 'src/utils/evm/typed-v1-signature-hash';
import {
  OldTypedDataField,
  validateOldSignTypedDataParams,
  validatePersonalSignParams,
  validateSendTransactionParams,
  validateSignTypedDataParams,
  validateWatchAssetParams
} from 'src/utils/evm/validation-schemas';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';
import { isDefined } from 'src/utils/is-defined';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';
import { isSupportedWcMethod } from 'src/walletconnect/constants';

type EvmSignTypedDataMethod =
  | 'eth_signTypedData'
  | 'eth_signTypedData_v1'
  | 'eth_signTypedData_v3'
  | 'eth_signTypedData_v4';

interface HandleWcEvmRequestParams {
  method: string;
  params: unknown;
  /**
   * Account expected to authorize the request (from the WC session / request payload).
   */
  address: HexString;
  /**
   * Required for `eth_sendTransaction` and `wallet_watchAsset`.
   */
  network?: EvmNetworkEssentials;
}

interface WcEvmRequestServiceDependencies {
  getAccount: (address: HexString) => Promise<LocalAccount>;
  sendTransaction: (
    network: EvmNetworkEssentials,
    account: LocalAccount,
    transaction: ParsedEvmRpcTransactionRequest
  ) => Promise<Hash>;
  dispatch: (action: AnyAction) => void;
  getTokenMetadata: (
    network: EvmNetworkEssentials,
    contract: HexString
  ) => Promise<EvmTokenOnChainMetadata | undefined>;
}

const defaultDependencies: WcEvmRequestServiceDependencies = {
  getAccount: address => firstValueFrom(Shelter.getEvmAccount$(address)),
  sendTransaction: (network, account, transaction) =>
    getViemWalletClient(network, account).sendTransaction({ account, ...transaction }),
  dispatch: defaultDispatch,
  getTokenMetadata: getEvmTokenMetadata
};

/**
 * Handles WalletConnect EVM JSON-RPC session requests: param validation, local signing,
 * eth_sendTransaction broadcasting, and wallet_watchAsset.
 */
class WcEvmRequestService {
  private readonly dependencies: WcEvmRequestServiceDependencies;

  constructor(dependencies: Partial<WcEvmRequestServiceDependencies> = {}) {
    this.dependencies = { ...defaultDependencies, ...dependencies };
  }

  async handle({ method, params, address, network }: HandleWcEvmRequestParams): Promise<unknown> {
    if (!isSupportedWcMethod(method)) {
      throw new WcEvmRequestError('unsupported-method', `Unsupported JSON-RPC method: ${method}`);
    }

    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return [address];
      case 'personal_sign':
        return this.personalSign(address, asParamsArray(params));
      case 'eth_signTypedData':
      case 'eth_signTypedData_v1':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
        return this.signTypedData(address, asParamsArray(params), method);
      case 'eth_sendTransaction':
        return this.sendTransaction(address, asParamsArray(params), network);
      case 'wallet_watchAsset':
        return this.watchAsset(address, params, network);
      default: {
        const exhaustiveCheck: never = method;

        throw new WcEvmRequestError('unsupported-method', `Unsupported JSON-RPC method: ${exhaustiveCheck}`);
      }
    }
  }

  private async personalSign(address: HexString, params: unknown[]): Promise<Hex> {
    const [message, requestedAddress] = validatePersonalSignParams(params);

    this.assertMatchingAddress(requestedAddress, address);

    const account = await this.getVerifiedAccount(address);

    try {
      return await account.signMessage({ message: { raw: message } });
    } catch (cause) {
      throw new WcEvmRequestError('signing-failed', 'Failed to sign the personal_sign message', { cause });
    }
  }

  private async signTypedData(address: HexString, params: unknown[], method: EvmSignTypedDataMethod): Promise<Hex> {
    let typedData: TypedDataDefinition | OldTypedDataField[];
    let requestedAddress: HexString;
    if (method === 'eth_signTypedData' || method === 'eth_signTypedData_v1') {
      [typedData, requestedAddress] = validateOldSignTypedDataParams(params);
    } else {
      [requestedAddress, typedData] = validateSignTypedDataParams(params);
    }

    this.assertMatchingAddress(requestedAddress, address);

    const account = await this.getVerifiedAccount(address);

    try {
      if (Array.isArray(typedData)) {
        if (!account.sign) {
          throw new WcEvmRequestError('signing-failed', 'Cannot sign V1 typed data');
        }

        return await account.sign({ hash: `0x${typedV1SignatureHash(typedData).toString('hex')}` });
      }

      return await account.signTypedData(typedData);
    } catch (cause) {
      throw new WcEvmRequestError('signing-failed', 'Failed to sign typed data', { cause });
    }
  }

  private async sendTransaction(address: HexString, params: unknown[], network?: EvmNetworkEssentials): Promise<Hash> {
    if (!isDefined(network)) {
      throw new WcEvmRequestError('invalid-params', 'eth_sendTransaction requires a network');
    }

    const [rawTransaction] = validateSendTransactionParams(params);

    this.assertMatchingAddress(rawTransaction.from, address);

    const account = await this.getVerifiedAccount(address);
    const request = parseRpcTransactionRequest(rawTransaction);

    try {
      return await this.dependencies.sendTransaction(network, account, request);
    } catch (cause) {
      throw new WcEvmRequestError('broadcast-failed', 'Failed to broadcast the transaction', { cause });
    }
  }

  private async watchAsset(address: HexString, params: unknown, network?: EvmNetworkEssentials): Promise<true> {
    if (!isDefined(network)) {
      throw new WcEvmRequestError('invalid-params', 'wallet_watchAsset requires a network');
    }

    const { options } = validateWatchAssetParams(params);
    const tokenAddress = getAddress(options.address);
    const slug = tokenAddress.toLowerCase();

    let onChainMetadata: EvmTokenOnChainMetadata | undefined;

    try {
      onChainMetadata = await this.dependencies.getTokenMetadata(network, tokenAddress);
    } catch (cause) {
      throw new WcEvmRequestError('invalid-params', 'Failed to fetch token metadata', { cause });
    }

    const decimals = options.decimals ?? onChainMetadata?.decimals;

    if (decimals === undefined) {
      throw new WcEvmRequestError(
        'invalid-params',
        'wallet_watchAsset requires decimals in the request or on-chain ERC-20 metadata'
      );
    }

    const metadata: EvmTokenMetadata = {
      address: tokenAddress,
      standard: EvmAssetStandardEnum.ERC20,
      name: onChainMetadata?.name,
      symbol: options.symbol ?? onChainMetadata?.symbol,
      decimals,
      ...(isDefined(options.image) ? { iconURL: options.image } : {})
    };

    this.dependencies.dispatch(
      setEvmAssetManualAction({
        account: address,
        chainId: network.chainId,
        slug,
        manual: true,
        standard: EvmAssetStandardEnum.ERC20
      })
    );
    this.dependencies.dispatch(
      processLoadedEvmTokensMetadataAction({
        chainId: network.chainId,
        metadata: { [slug]: metadata }
      })
    );

    return true;
  }

  private async getVerifiedAccount(address: HexString): Promise<LocalAccount> {
    let account: LocalAccount;

    try {
      account = await this.dependencies.getAccount(address);
    } catch (cause) {
      throw new WcEvmRequestError('account-unavailable', 'Unable to access the selected account', { cause });
    }

    let isMatchingAccount = false;

    try {
      isMatchingAccount = isAddressEqual(account.address, address);
    } catch (cause) {
      throw new WcEvmRequestError(
        'signer-address-mismatch',
        'The revealed signer or selected account address is invalid',
        { cause }
      );
    }

    if (!isMatchingAccount) {
      throw new WcEvmRequestError('signer-address-mismatch', 'The revealed signer does not match the selected account');
    }

    return account;
  }

  private assertMatchingAddress(requestedAddress: HexString | undefined, expectedAddress: HexString) {
    if (!isDefined(requestedAddress)) {
      throw new WcEvmRequestError('invalid-params', 'Request address is missing or invalid');
    }

    let isMatchingAddress = false;

    try {
      isMatchingAddress = isAddressEqual(requestedAddress, expectedAddress);
    } catch (cause) {
      throw new WcEvmRequestError('signer-address-mismatch', 'Request address is invalid', { cause });
    }

    if (!isMatchingAddress) {
      throw new WcEvmRequestError('signer-address-mismatch', 'Request address does not match the selected account');
    }
  }
}

const asParamsArray = (params: unknown): unknown[] => {
  if (!Array.isArray(params)) {
    throw new WcEvmRequestError('invalid-params', 'JSON-RPC params must be an array');
  }

  return params;
};

export const wcEvmRequestService = new WcEvmRequestService();
