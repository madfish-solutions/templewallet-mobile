import { mockTezosMetadataApi } from '../api.service.mock';

import { rxJsTestingHelper } from './testing.utils';
import {
  loadTokenMetadata$,
  loadTokensMetadata$,
  mapMetadataChunkResponses,
  shouldRetryMetadataNulls,
  TokenMetadataResponse
} from './token-metadata.utils';

describe('loadTokenMetadata$', () => {
  const mockAddress = 'mockAddress';
  const mockId = 777;
  const mockApiResponse: TokenMetadataResponse = {
    decimals: 88,
    symbol: 'TST',
    name: 'Mocked Token',
    thumbnailUri: 'https://pepe-the-frogerenko.com'
  };

  beforeAll(() => {
    mockTezosMetadataApi.get.mockReturnValue(Promise.resolve({ data: mockApiResponse }));
  });

  it('should return correct TokenMetadataInterface structure', done =>
    void loadTokenMetadata$(mockAddress, mockId).subscribe(
      rxJsTestingHelper(tokenMetadata => {
        expect(tokenMetadata.id).toEqual(mockId);
        expect(tokenMetadata.address).toEqual(mockAddress);
        expect(tokenMetadata.decimals).toEqual(mockApiResponse.decimals);
        expect(tokenMetadata.symbol).toEqual(mockApiResponse.symbol);
        expect(tokenMetadata.name).toEqual(mockApiResponse.name);
        expect(tokenMetadata.thumbnailUri).toEqual(mockApiResponse.thumbnailUri);
      }, done)
    ));

  it('should set default id if it was not provided', done =>
    void loadTokenMetadata$(mockAddress).subscribe(
      rxJsTestingHelper(tokenMetadata => {
        expect(tokenMetadata.id).toEqual(0);
      }, done)
    ));

  it('should set symbol from name first 8 symbols if token has no symbol', done => {
    const mockApiResponseWithoutSymbol = {
      ...mockApiResponse,
      symbol: undefined
    };

    mockTezosMetadataApi.get.mockReturnValue(Promise.resolve({ data: mockApiResponseWithoutSymbol }));

    loadTokenMetadata$(mockAddress).subscribe(
      rxJsTestingHelper(tokenMetadata => {
        expect(tokenMetadata.symbol).toEqual('Mocked T');
      }, done)
    );
  });

  it('should set name from symbol if token has no name', done => {
    const mockApiResponseWithoutName = {
      ...mockApiResponse,
      name: undefined
    };

    mockTezosMetadataApi.get.mockReturnValue(Promise.resolve({ data: mockApiResponseWithoutName }));

    loadTokenMetadata$(mockAddress).subscribe(
      rxJsTestingHelper(tokenMetadata => {
        expect(tokenMetadata.name).toEqual(mockApiResponseWithoutName.symbol);
      }, done)
    );
  });

  it('should set default name and symbol if token has not them', done => {
    const mockApiResponseWithoutSymbolAndName = {
      ...mockApiResponse,
      symbol: undefined,
      name: undefined
    };

    mockTezosMetadataApi.get.mockReturnValue(Promise.resolve({ data: mockApiResponseWithoutSymbolAndName }));

    loadTokenMetadata$(mockAddress).subscribe(
      rxJsTestingHelper(tokenMetadata => {
        expect(tokenMetadata.symbol).toEqual('???');
        expect(tokenMetadata.name).toEqual('Unknown Token');
      }, done)
    );
  });
});

describe('shouldRetryMetadataNulls', () => {
  it('always retries remaining nulls once', () => {
    expect(shouldRetryMetadataNulls(2, 3, 0)).toBe(true);
    expect(shouldRetryMetadataNulls(3, 3, 0)).toBe(true);
  });

  it('continues only while remaining nulls are at most 90% of the input', () => {
    expect(shouldRetryMetadataNulls(90, 100, 1)).toBe(true);
    expect(shouldRetryMetadataNulls(91, 100, 1)).toBe(false);
  });

  it('stops when nothing is left or the round cap is reached', () => {
    expect(shouldRetryMetadataNulls(0, 10, 0)).toBe(false);
    expect(shouldRetryMetadataNulls(1, 2, 10)).toBe(false);
  });
});

describe('mapMetadataChunkResponses', () => {
  const token: TokenMetadataResponse = {
    decimals: 0,
    symbol: 'NFT',
    name: 'Collectible'
  };

  it('keeps metadata, collects null slugs, and applies overrides', () => {
    const result = mapMetadataChunkResponses(
      ['KT1aaa_1', 'KT1bbb_2', 'KT1KEsRsSMvSkgZ9CwYy5fPA1e4j3TEpuiKK_0'],
      [token, null, null]
    );

    expect(result.nullSlugs).toEqual(['KT1bbb_2']);
    expect(result.metadata).toEqual([
      expect.objectContaining({ address: 'KT1aaa', id: 1, symbol: 'NFT' }),
      expect.objectContaining({ address: 'KT1KEsRsSMvSkgZ9CwYy5fPA1e4j3TEpuiKK', symbol: 'WEED' })
    ]);
  });
});

describe('loadTokensMetadata$', () => {
  const token = (symbol: string): TokenMetadataResponse => ({
    decimals: 0,
    symbol,
    name: symbol
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockTezosMetadataApi.post.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const collectUntilComplete = async (slugs: string[]) => {
    const batches: { address: string; id: number }[][] = [];
    const finished = new Promise<void>((resolve, reject) => {
      loadTokensMetadata$(slugs).subscribe({
        next: metadata => batches.push(metadata.map(({ address, id }) => ({ address, id }))),
        error: reject,
        complete: () => resolve()
      });
    });

    for (let i = 0; i < 50; i++) {
      await Promise.resolve();
      jest.advanceTimersByTime(1000);
    }

    await finished;

    return batches;
  };

  it('retries majority-null slugs once and emits recovered metadata', async () => {
    mockTezosMetadataApi.post
      .mockResolvedValueOnce({ data: [token('A'), null, null] })
      .mockResolvedValueOnce({ data: [token('B'), token('C')] });

    const batches = await collectUntilComplete(['KT1aaa_1', 'KT1bbb_2', 'KT1ccc_3']);

    expect(mockTezosMetadataApi.post).toHaveBeenCalledTimes(2);
    expect(mockTezosMetadataApi.post).toHaveBeenNthCalledWith(2, '/', ['KT1bbb_2', 'KT1ccc_3']);
    expect(batches.flat()).toEqual([
      { address: 'KT1aaa', id: 1 },
      { address: 'KT1bbb', id: 2 },
      { address: 'KT1ccc', id: 3 }
    ]);
  });

  it('does not start the next null-retry wave immediately', async () => {
    mockTezosMetadataApi.post
      .mockResolvedValueOnce({ data: [token('A'), null] })
      .mockResolvedValueOnce({ data: [token('B')] });

    loadTokensMetadata$(['KT1aaa_1', 'KT1bbb_2']).subscribe();

    await Promise.resolve();
    await Promise.resolve();
    expect(mockTezosMetadataApi.post).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(mockTezosMetadataApi.post).toHaveBeenCalledTimes(1);
  });

  it('stops further null retries when remaining nulls stay above 90% of that wave', async () => {
    mockTezosMetadataApi.post
      .mockResolvedValueOnce({ data: [token('A'), null, null, null] })
      .mockResolvedValueOnce({ data: [null, null, null] });

    const batches = await collectUntilComplete(['KT1aaa_1', 'KT1bbb_2', 'KT1ccc_3', 'KT1ddd_4']);

    expect(mockTezosMetadataApi.post).toHaveBeenCalledTimes(2);
    expect(batches.flat()).toEqual([{ address: 'KT1aaa', id: 1 }]);
  });

  it('retries leftover nulls against the full submit after every HTTP chunk has finished', async () => {
    const slugs = Array.from({ length: 200 }, (_, i) => `KT1aaa_${i}`);
    const attemptsBySlug = new Map<string, number>();
    const flakyIds = new Set(Array.from({ length: 60 }, (_, i) => i));

    mockTezosMetadataApi.post.mockImplementation((_url: string, requested: string[]) =>
      Promise.resolve({
        data: requested.map(slug => {
          const id = Number(slug.split('_')[1]);
          const attempt = (attemptsBySlug.get(slug) ?? 0) + 1;
          attemptsBySlug.set(slug, attempt);

          if (!flakyIds.has(id)) {
            return token('OK');
          }

          if (attempt === 1) {
            return null;
          }

          if (attempt === 2) {
            return id < 10 ? token('R2') : null;
          }

          return token('R3');
        })
      })
    );

    const batches = await collectUntilComplete(slugs);
    const thirdAttemptCount = [...attemptsBySlug.values()].filter(attempt => attempt >= 3).length;

    expect(thirdAttemptCount).toBe(50);
    expect(batches.flat()).toHaveLength(200);
  });
});
