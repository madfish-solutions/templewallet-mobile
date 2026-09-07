import { aggregateObjktCollectiblesChunkResults } from './collectibles-by-slugs.utils';
import { ObjktCollectiblesBySlugsError } from './errors';
import { ObjktCollectibleDetails } from './types';

const token = (contract: string, id: string) =>
  ({
    fa_contract: contract,
    token_id: id
  } as ObjktCollectibleDetails);

describe('aggregateObjktCollectiblesChunkResults', () => {
  it('keeps successful tokens, marks missing slugs, and isolates failed chunk slugs', () => {
    const failedSlugs = ['KT1fail_1', 'KT1fail_2'];
    const result = aggregateObjktCollectiblesChunkResults([
      {
        slugs: ['KT1ok_1', 'KT1ok_2'],
        tokens: [token('KT1ok', '1')]
      },
      {
        slugs: failedSlugs,
        error: new ObjktCollectiblesBySlugsError(failedSlugs, new Error('timeout'))
      }
    ]);

    expect(result.tokens).toEqual([token('KT1ok', '1')]);
    expect(result.missingSlugs).toEqual(['KT1ok_2']);
    expect(result.failedSlugs).toEqual(failedSlugs);
    expect(result.error).toBeInstanceOf(ObjktCollectiblesBySlugsError);
    expect(result.error?.slugs).toEqual(failedSlugs);
  });
});
