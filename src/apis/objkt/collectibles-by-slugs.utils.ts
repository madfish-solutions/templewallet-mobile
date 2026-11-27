import { toTokenSlug } from 'src/token/utils/token.utils';

import { ObjktCollectiblesBySlugsError } from './errors';
import { ObjktCollectibleDetails } from './types';

export interface ObjktCollectiblesBySlugsBatch {
  tokens: ObjktCollectibleDetails[];
  /** Requested slugs whose chunk succeeded but Objkt returned no row. */
  missingSlugs: string[];
  /** Slugs whose chunk failed after retries. Details must stay `undefined`. */
  failedSlugs: string[];
  error?: ObjktCollectiblesBySlugsError;
}

export type ObjktCollectiblesChunkResult =
  | { slugs: string[]; tokens: ObjktCollectibleDetails[] }
  | { slugs: string[]; error: ObjktCollectiblesBySlugsError };

export const aggregateObjktCollectiblesChunkResults = (
  results: ObjktCollectiblesChunkResult[]
): ObjktCollectiblesBySlugsBatch => {
  let tokens: ObjktCollectibleDetails[] = [];
  const missingSlugs: string[] = [];
  let failedSlugs: string[] = [];
  const errors: ObjktCollectiblesBySlugsError[] = [];

  for (const result of results) {
    if ('error' in result) {
      failedSlugs = failedSlugs.concat(result.slugs);
      errors.push(result.error);
      continue;
    }

    tokens = tokens.concat(result.tokens);

    const returnedSlugs = new Set(result.tokens.map(token => toTokenSlug(token.fa_contract, token.token_id)));

    for (const slug of result.slugs) {
      if (!returnedSlugs.has(slug)) {
        missingSlugs.push(slug);
      }
    }
  }

  return {
    tokens,
    missingSlugs,
    failedSlugs,
    error: errors.length > 0 ? new ObjktCollectiblesBySlugsError(failedSlugs, errors[0]) : undefined
  };
};
