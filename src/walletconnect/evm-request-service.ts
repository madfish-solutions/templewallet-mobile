import { AnyAction } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { getAddress, Hash, isAddressEqual, TypedDataDefinition } from 'viem';
import { LocalAccount } from 'viem/accounts';

import { Shelter } from 'src/shelter/shelter';
import { dispatch as defaultDispatch } from 'src/store';
import { setEvmAssetManualAction } from 'src/store/evm/assets/evm-assets-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { EvmAssetStandardEnum, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';
import {
  OldTypedData,
  StrictWcSessionRequestContent,
  WcPersonalSignRequestContent,
  WcSendTransactionRequestContent,
  WcSignTypedDataRequestContent,
  WcWatchAssetRequestContent,
  isStrictWcSigningRequestContent,
  isWcAccountsRequestContent,
  isWcOldTypedDataRequestContent,
  isWcPersonalSignRequestContent
} from 'src/types/strict-wc-session-request';
import { getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';
import { EvmTokenOnChainMetadata } from 'src/utils/evm/on-chain/types';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { typedV1SignatureHash } from 'src/utils/evm/typed-v1-signature-hash';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';
import { isDefined } from 'src/utils/is-defined';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';
type HandleWcEvmRequestParams = Exclude<StrictWcSessionRequestContent, WcSendTransactionRequestContent> & {
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
};

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

  async handle({ address, network, ...requestContent }: HandleWcEvmRequestParams) {
    if (isWcAccountsRequestContent(requestContent)) {
      return [address];
    }

    if (isWcPersonalSignRequestContent(requestContent)) {
      return this.personalSign(address, requestContent.params);
    }

    if (isStrictWcSigningRequestContent(requestContent)) {
      return this.signTypedData(address, requestContent);
    }

    return this.watchAsset(address, requestContent.params, network);
  }

  async personalSign(address: HexString, params: WcPersonalSignRequestContent['params']) {
    const [message, requestedAddress] = params;

    this.assertMatchingAddress(requestedAddress, address);

    const account = await this.getVerifiedAccount(address);

    try {
      return await account.signMessage({ message: { raw: message } });
    } catch (cause) {
      throw new WcEvmRequestError('signing-failed', 'Failed to sign the personal_sign message', { cause });
    }
  }

  async signTypedData(address: HexString, requestContent: WcSignTypedDataRequestContent) {
    let typedData: TypedDataDefinition | OldTypedData;
    let requestedAddress: HexString;
    if (isWcOldTypedDataRequestContent(requestContent)) {
      [typedData, requestedAddress] = requestContent.params;
    } else {
      [requestedAddress, typedData] = requestContent.params;
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

  async watchAsset(
    address: HexString,
    { options }: WcWatchAssetRequestContent['params'],
    network?: EvmNetworkEssentials
  ) {
    if (!isDefined(network)) {
      throw new WcEvmRequestError('invalid-params', 'wallet_watchAsset requires a network');
    }

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
      iconURL: options.image
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

    return true as const;
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

export const wcEvmRequestService = new WcEvmRequestService();
