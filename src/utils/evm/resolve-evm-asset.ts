import { isAxiosError } from 'axios';
import { getAddress } from 'viem';

import { fetchGetTokenInfo } from 'src/apis/etherlink';
import { buildEvmCollectibleMetadataFromOnChain } from 'src/store/evm/collectibles-metadata/utils';
import { buildEvmTokenMetadataFromApi, buildEvmTokenMetadataFromOnChain } from 'src/store/evm/tokens-metadata/utils';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EvmTokenMetadata
} from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';
import { isDefined } from 'src/utils/is-defined';

import { detectTokenStandard } from './on-chain/common.utils';
import { getEvmCollectibleMetadata, getEvmTokenMetadata } from './on-chain/metadata';
import { EvmCollectibleAssetStandard, EvmContractAssetStandard } from './on-chain/types';

const EXPLORER_TIMEOUT = 5000;
const COLLECTIBLE_METADATA_TIMEOUT = 15_000;
const METADATA_TIMED_OUT = Symbol('collectible-metadata-timeout');

type Erc20TokenResolutionResult =
  | { type: 'erc20'; metadata: EvmTokenMetadata & { decimals: number }; exchangeRate?: number }
  | { type: 'not-erc20' }
  | { type: 'not-found' }
  | { type: 'unavailable' };

type EvmCollectibleResolutionResult =
  | { type: 'collectible'; metadata: EvmCollectibleMetadata & { standard: EvmCollectibleAssetStandard } }
  | { type: 'erc20-with-id' }
  | { type: 'not-found' }
  | { type: 'unavailable' };

const parseApiRate = (value: string | null | undefined): number | undefined => {
  if (value == null || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseApiDecimals = (value: string | null | undefined): number | undefined => {
  const parsed = parseApiRate(value);

  return parsed !== undefined && Number.isInteger(parsed) && parsed >= 0 && parsed <= 255 ? parsed : undefined;
};

const isNotFoundError = (error: unknown) => isAxiosError(error) && error.response?.status === 404;

export const resolveErc20Token = async (
  network: EvmNetworkEssentials,
  address: HexString
): Promise<Erc20TokenResolutionResult> => {
  let explorerUnavailable = false;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), EXPLORER_TIMEOUT);

  const tokenInfo = await fetchGetTokenInfo(address, abortController.signal)
    .catch((error: unknown) => {
      explorerUnavailable = !isNotFoundError(error);

      return undefined;
    })
    .finally(() => clearTimeout(timeout));

  if (isDefined(tokenInfo) && tokenInfo.type !== 'ERC-20') {
    return { type: 'not-erc20' };
  }

  const checksummedAddress = getAddress(address);
  const apiDecimals = parseApiDecimals(tokenInfo?.decimals);
  const exchangeRate = parseApiRate(tokenInfo?.exchange_rate);

  if (isDefined(tokenInfo) && isDefined(apiDecimals)) {
    return {
      type: 'erc20',
      metadata: {
        ...buildEvmTokenMetadataFromApi(tokenInfo, apiDecimals),
        address: checksummedAddress,
        decimals: apiDecimals
      },
      exchangeRate
    };
  }

  const [standard, onChainMetadata] = await Promise.all([
    detectTokenStandard(network, address),
    getEvmTokenMetadata(network, address)
  ]);

  if (standard === EvmAssetStandardEnum.ERC721 || standard === EvmAssetStandardEnum.ERC1155) {
    return { type: 'not-erc20' };
  }

  const onChainDecimals = onChainMetadata?.decimals;

  if (!onChainMetadata || onChainDecimals == null) {
    return { type: explorerUnavailable ? 'unavailable' : 'not-found' };
  }

  const base = buildEvmTokenMetadataFromOnChain(checksummedAddress, onChainMetadata, onChainDecimals);

  return {
    type: 'erc20',
    metadata: {
      ...base,
      decimals: onChainDecimals,
      name: base.name ?? tokenInfo?.name ?? undefined,
      symbol: base.symbol ?? tokenInfo?.symbol ?? undefined,
      iconURL: tokenInfo?.icon_url ?? undefined
    },
    exchangeRate
  };
};

export const resolveEvmCollectible = async (
  network: EvmNetworkEssentials,
  address: HexString,
  tokenId: string
): Promise<EvmCollectibleResolutionResult> => {
  let explorerUnavailable = false;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), EXPLORER_TIMEOUT);

  const tokenInfo = await fetchGetTokenInfo(address, abortController.signal)
    .catch((error: unknown) => {
      explorerUnavailable = !isNotFoundError(error);

      return undefined;
    })
    .finally(() => clearTimeout(timeout));

  if (tokenInfo?.type === 'ERC-20') {
    return { type: 'erc20-with-id' };
  }

  let standard: EvmContractAssetStandard | undefined;
  if (tokenInfo?.type === 'ERC-721') {
    standard = EvmAssetStandardEnum.ERC721;
  } else if (tokenInfo?.type === 'ERC-1155') {
    standard = EvmAssetStandardEnum.ERC1155;
  } else {
    standard = await detectTokenStandard(network, address);
  }

  if (standard === EvmAssetStandardEnum.ERC20) {
    return { type: 'erc20-with-id' };
  }

  if (standard !== EvmAssetStandardEnum.ERC721 && standard !== EvmAssetStandardEnum.ERC1155) {
    return { type: explorerUnavailable ? 'unavailable' : 'not-found' };
  }

  const checksummedAddress = getAddress(address);

  let metadataTimeout: ReturnType<typeof setTimeout> | undefined;

  const metadata = await Promise.race([
    getEvmCollectibleMetadata(network, checksummedAddress, tokenId, standard),
    new Promise<typeof METADATA_TIMED_OUT>(resolve => {
      metadataTimeout = setTimeout(() => resolve(METADATA_TIMED_OUT), COLLECTIBLE_METADATA_TIMEOUT);
    })
  ]).finally(() => clearTimeout(metadataTimeout));

  if (metadata === METADATA_TIMED_OUT) {
    return { type: 'unavailable' };
  }

  if (!metadata) {
    return { type: explorerUnavailable ? 'unavailable' : 'not-found' };
  }

  return {
    type: 'collectible',
    metadata: { ...buildEvmCollectibleMetadataFromOnChain(checksummedAddress, tokenId, standard, metadata), standard }
  };
};
