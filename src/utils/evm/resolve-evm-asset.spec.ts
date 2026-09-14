import { getAddress } from 'viem';

import { fetchGetTokenInfo, EtherlinkTokenInfo } from 'src/apis/etherlink';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { detectTokenStandard } from './on-chain/common.utils';
import { getEvmCollectibleMetadata, getEvmTokenMetadata } from './on-chain/metadata';
import { resolveErc20Token, resolveEvmCollectible } from './resolve-evm-asset';

jest.mock('src/apis/etherlink', () => ({ fetchGetTokenInfo: jest.fn() }));
jest.mock('./on-chain/common.utils', () => ({ detectTokenStandard: jest.fn() }));
jest.mock('./on-chain/metadata', () => ({ getEvmCollectibleMetadata: jest.fn(), getEvmTokenMetadata: jest.fn() }));

const mockFetchGetTokenInfo = jest.mocked(fetchGetTokenInfo);
const mockDetectTokenStandard = jest.mocked(detectTokenStandard);
const mockGetEvmTokenMetadata = jest.mocked(getEvmTokenMetadata);
const mockGetEvmCollectibleMetadata = jest.mocked(getEvmCollectibleMetadata);

const ADDRESS = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';
const CHECKSUMMED_ADDRESS = getAddress(ADDRESS);

const network: EvmNetworkEssentials = { rpcBaseURL: 'https://rpc.test', chainId: ETHERLINK_MAINNET_CHAIN_ID };

const makeTokenInfo = (overrides: Partial<EtherlinkTokenInfo> = {}): EtherlinkTokenInfo => ({
  icon_url: 'https://icons.test/tst.png',
  name: 'Test Token',
  decimals: '6',
  symbol: 'TST',
  address: ADDRESS,
  address_hash: ADDRESS,
  type: 'ERC-20',
  exchange_rate: '1.25',
  ...overrides
});

const makeAxiosError = (status?: number) =>
  Object.assign(new Error('http error'), {
    isAxiosError: true,
    response: status === undefined ? undefined : { status }
  });

describe('resolveErc20Token', () => {
  beforeEach(() => jest.resetAllMocks());

  it('returns API metadata with a checksummed address without touching the chain', async () => {
    mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo());

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({
      type: 'erc20',
      metadata: {
        address: CHECKSUMMED_ADDRESS,
        standard: EvmAssetStandardEnum.ERC20,
        name: 'Test Token',
        symbol: 'TST',
        decimals: 6,
        iconURL: 'https://icons.test/tst.png'
      },
      exchangeRate: 1.25
    });
    expect(mockDetectTokenStandard).not.toHaveBeenCalled();
    expect(mockGetEvmTokenMetadata).not.toHaveBeenCalled();
  });

  it('rejects an API-known NFT without touching the chain', async () => {
    mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo({ type: 'ERC-721' }));

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({ type: 'not-erc20' });
    expect(mockDetectTokenStandard).not.toHaveBeenCalled();
  });

  it.each(['', '  ', 'abc', '-1', '18.5', '300'])(
    'falls back to on-chain metadata when API decimals is %j',
    async decimals => {
      mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo({ decimals }));
      mockDetectTokenStandard.mockResolvedValue(undefined);
      mockGetEvmTokenMetadata.mockResolvedValue({ name: 'Chain Name', symbol: 'CHN', decimals: 18 });

      await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({
        type: 'erc20',
        metadata: {
          address: CHECKSUMMED_ADDRESS,
          standard: EvmAssetStandardEnum.ERC20,
          name: 'Chain Name',
          symbol: 'CHN',
          decimals: 18,
          iconURL: 'https://icons.test/tst.png'
        },
        exchangeRate: 1.25
      });
    }
  );

  it('maps an explorer 404 plus an empty chain read to not-found', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(undefined);
    mockGetEvmTokenMetadata.mockResolvedValue(undefined);

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({ type: 'not-found' });
  });

  it('maps an explorer outage plus an empty chain read to unavailable', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(new Error('network down'));
    mockDetectTokenStandard.mockResolvedValue(undefined);
    mockGetEvmTokenMetadata.mockResolvedValue(undefined);

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({ type: 'unavailable' });
  });

  it('classifies an on-chain NFT as not-erc20 when the explorer lacks the token', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandardEnum.ERC721);
    mockGetEvmTokenMetadata.mockResolvedValue(undefined);

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({ type: 'not-erc20' });
  });

  it('treats on-chain metadata without decimals as not-found', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(undefined);
    mockGetEvmTokenMetadata.mockResolvedValue({ name: 'X', symbol: 'X', decimals: undefined });

    await expect(resolveErc20Token(network, ADDRESS)).resolves.toEqual({ type: 'not-found' });
  });

  it('aborts a hanging explorer request after the timeout and reports unavailable', async () => {
    jest.useFakeTimers();
    try {
      mockFetchGetTokenInfo.mockImplementation(
        (_address, signal) =>
          new Promise((_resolve, reject) => signal?.addEventListener('abort', () => reject(makeAxiosError())))
      );
      mockDetectTokenStandard.mockResolvedValue(undefined);
      mockGetEvmTokenMetadata.mockResolvedValue(undefined);

      const promise = resolveErc20Token(network, ADDRESS);
      await jest.advanceTimersByTimeAsync(5000);

      await expect(promise).resolves.toEqual({ type: 'unavailable' });
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('resolveEvmCollectible', () => {
  const TOKEN_ID = '4321';
  const onChainMetadata = {
    metadataUri: 'ipfs://meta',
    name: 'Cool Collection',
    symbol: 'COOL',
    collectibleName: 'Cool #4321',
    image: 'ipfs://image'
  };

  beforeEach(() => jest.resetAllMocks());

  it('rejects an API-known ERC-20 contract without touching the chain', async () => {
    mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo());

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({ type: 'erc20-with-id' });
    expect(mockDetectTokenStandard).not.toHaveBeenCalled();
    expect(mockGetEvmCollectibleMetadata).not.toHaveBeenCalled();
  });

  it('resolves an API-known ERC-721 via on-chain metadata without re-detecting the standard', async () => {
    mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo({ type: 'ERC-721' }));
    mockGetEvmCollectibleMetadata.mockResolvedValue(onChainMetadata);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({
      type: 'collectible',
      metadata: {
        ...onChainMetadata,
        address: CHECKSUMMED_ADDRESS,
        tokenId: TOKEN_ID,
        standard: EvmAssetStandardEnum.ERC721
      }
    });
    expect(mockDetectTokenStandard).not.toHaveBeenCalled();
    expect(mockGetEvmCollectibleMetadata).toHaveBeenCalledWith(
      network,
      CHECKSUMMED_ADDRESS,
      TOKEN_ID,
      EvmAssetStandardEnum.ERC721
    );
  });

  it('falls back to on-chain standard detection when the explorer lacks the contract', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandardEnum.ERC1155);
    mockGetEvmCollectibleMetadata.mockResolvedValue(onChainMetadata);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({
      type: 'collectible',
      metadata: {
        ...onChainMetadata,
        address: CHECKSUMMED_ADDRESS,
        tokenId: TOKEN_ID,
        standard: EvmAssetStandardEnum.ERC1155
      }
    });
  });

  it('falls back to on-chain detection when the explorer reports a type outside the known standards', async () => {
    // the explorer emits types the typed union does not know, e.g. ERC-404
    mockFetchGetTokenInfo.mockResolvedValue(Object.assign(makeTokenInfo(), { type: 'ERC-404' }));
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandardEnum.ERC721);
    mockGetEvmCollectibleMetadata.mockResolvedValue(onChainMetadata);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toMatchObject({ type: 'collectible' });
    expect(mockDetectTokenStandard).toHaveBeenCalledWith(network, ADDRESS);
  });

  it('rejects a chain-detected ERC-20 contract as erc20-with-id', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandardEnum.ERC20);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({ type: 'erc20-with-id' });
    expect(mockGetEvmCollectibleMetadata).not.toHaveBeenCalled();
  });

  it('maps an unrecognized contract to not-found or unavailable by explorer state', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(undefined);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({ type: 'not-found' });

    mockFetchGetTokenInfo.mockRejectedValue(new Error('network down'));
    mockDetectTokenStandard.mockResolvedValue(undefined);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({ type: 'unavailable' });
  });

  it('propagates an RPC outage from standard detection instead of reporting not-found', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockRejectedValue(new Error('rpc down'));

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).rejects.toThrow('rpc down');
  });

  it('treats a failed metadata read for a valid NFT contract as not-found', async () => {
    mockFetchGetTokenInfo.mockRejectedValue(makeAxiosError(404));
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandardEnum.ERC721);
    mockGetEvmCollectibleMetadata.mockResolvedValue(undefined);

    await expect(resolveEvmCollectible(network, ADDRESS, TOKEN_ID)).resolves.toEqual({ type: 'not-found' });
  });

  it('reports unavailable when the collectible metadata read hangs past the timeout', async () => {
    jest.useFakeTimers();
    try {
      mockFetchGetTokenInfo.mockResolvedValue(makeTokenInfo({ type: 'ERC-721' }));
      mockGetEvmCollectibleMetadata.mockImplementation(() => new Promise(() => void 0));

      const promise = resolveEvmCollectible(network, ADDRESS, TOKEN_ID);
      await jest.advanceTimersByTimeAsync(15_000);

      await expect(promise).resolves.toEqual({ type: 'unavailable' });
    } finally {
      jest.useRealTimers();
    }
  });
});
