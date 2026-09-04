/**
 * Docs: https://public-api-v3-20221206.objkt.com/docs
 * Explore: https://public-api-v3-20221206.objkt.com/explore
 */

import BigNumber from 'bignumber.js';
import { chunk } from 'lodash-es';
import { catchError, from, map, mergeMap, Observable, of, reduce, retry, throwError, timer } from 'rxjs';

import { Collection } from 'src/store/collectons/collections-state';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';

import {
  apolloObjktClient,
  FA_COLLECTION_PAGINATION_STEP,
  GALLERY_COLLECTION_PAGINATION_STEP,
  HIDDEN_CONTRACTS,
  OBJKT_COLLECTIBLES_QUERY_CHUNK_SIZE,
  OBJKT_COLLECTIBLES_QUERY_CONCURRENCY,
  OBJKT_COLLECTIBLES_QUERY_RETRY_BASE_DELAY_MS,
  OBJKT_COLLECTIBLES_QUERY_RETRY_COUNT,
  OBJKT_COLLECTIBLES_QUERY_TIMEOUT_MS
} from './constants';
import {
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectionsQuery,
  buildGetFA2AttributeCountQuery,
  buildGetGalleryAttributeCountQuery,
  buildGetCollectiblesQuery,
  buildGetCollectiblesByGalleryQuery,
  buildGetCollectibleExtraQuery
} from './queries';
import {
  ObjktCollectibleDetails,
  CollectiblesByCollectionResponse,
  CollectiblesByGalleriesResponse,
  FA2AttributeCountQueryResponse,
  GalleryAttributeCountQueryResponse,
  ObjktCollectibleExtra,
  QueryResponse,
  CollectiblesBySlugsResponse
} from './types';
import { transformObjktCollectionItem } from './utils';

export const fetchCollections$ = (accountPkh: string): Observable<Collection[]> => {
  const request = buildGetCollectionsQuery(accountPkh);

  return apolloObjktClient.fetch$<QueryResponse>(request).pipe(
    map(result => {
      const fa = result.fa
        .filter(item => !HIDDEN_CONTRACTS.includes(item.contract))
        .map<Collection>(item => {
          const logo = item.logo !== null ? item.logo : item.tokens[0].display_uri;

          return { name: item.name, logo, contract: item.contract, creator: accountPkh, type: item.__typename };
        });

      const gallery = result.gallery.map<Collection>(item => ({
        name: item.name,
        logo: item.logo,
        contract: item.tokens[0]!.fa_contract,
        creator: accountPkh,
        type: item.__typename,
        galleryPk: item.pk
      }));

      return [...fa, ...gallery];
    }),
    catchError(() => of([]))
  );
};

export const fetchCollectiblesOfCollection = (
  contract: string,
  creatorPkh: string,
  offset: number,
  galleryPk?: number
) => {
  if (isDefined(galleryPk)) {
    return apolloObjktClient
      .fetch<CollectiblesByGalleriesResponse>(buildGetCollectiblesByGalleryQuery(galleryPk, offset))
      .then(result => {
        if (!result) {
          throw new Error('No result');
        }

        const gallery = result.gallery[0];

        const items = gallery?.tokens.map(token => transformObjktCollectionItem(token.token)) ?? [];

        const collectionSize = gallery?.max_items ?? 0;

        const reachedTheEnd = items.length < GALLERY_COLLECTION_PAGINATION_STEP;

        return { items, collectionSize, reachedTheEnd };
      });
  }

  return apolloObjktClient
    .fetch<CollectiblesByCollectionResponse>(buildGetCollectiblesByCollectionQuery(contract, creatorPkh, offset))
    .then(data => {
      if (!data) {
        throw new Error('No result');
      }

      const items = data.token.map(transformObjktCollectionItem);

      const collectionSize = offset + items.length;

      const reachedTheEnd = items.length < FA_COLLECTION_PAGINATION_STEP;

      return { items, collectionSize, reachedTheEnd };
    });
};

export const fetchObjktCollectiblesBySlugs$ = (slugs: string[]): Observable<ObjktCollectibleDetails[]> => {
  if (slugs.length === 0) {
    return of([]);
  }

  return from(chunk(slugs, OBJKT_COLLECTIBLES_QUERY_CHUNK_SIZE)).pipe(
    mergeMap(
      slugsChunk =>
        fetchObjktCollectiblesBySlugsChunk$(slugsChunk).pipe(
          retry({
            count: OBJKT_COLLECTIBLES_QUERY_RETRY_COUNT,
            delay: (error, retryCount) =>
              isRetryableObjktQueryError(error)
                ? timer(OBJKT_COLLECTIBLES_QUERY_RETRY_BASE_DELAY_MS * 2 ** (retryCount - 1))
                : throwError(() => error)
          })
        ),
      OBJKT_COLLECTIBLES_QUERY_CONCURRENCY
    ),
    reduce<CollectiblesBySlugsResponse, ObjktCollectibleDetails[]>((acc, curr) => acc.concat(curr.token), [])
  );
};

const fetchObjktCollectiblesBySlugsChunk$ = (slugs: string[]) =>
  new Observable<CollectiblesBySlugsResponse>(subscriber => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OBJKT_COLLECTIBLES_QUERY_TIMEOUT_MS);

    apolloObjktClient
      .fetch<CollectiblesBySlugsResponse>(
        buildGetCollectiblesQuery(),
        { where: buildCollectiblesBySlugsWhere(slugs) },
        { context: { fetchOptions: { signal: controller.signal } } }
      )
      .then(data => {
        if (!isDefined(data)) {
          subscriber.error(new Error('Empty Objkt collectibles response'));

          return;
        }

        subscriber.next(data);
        subscriber.complete();
      })
      .catch(error => subscriber.error(error))
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  });

const buildCollectiblesBySlugsWhere = (slugs: string[]) => {
  const idsByContract: Record<string, string[]> = {};

  for (const slug of slugs) {
    const [contract, id] = fromTokenSlug(slug);
    const tokenIds = idsByContract[contract];

    if (isDefined(tokenIds)) {
      tokenIds.push(String(id));
    } else {
      idsByContract[contract] = [String(id)];
    }
  }

  return {
    _or: Object.entries(idsByContract).map(([contract, ids]) => ({
      fa_contract: { _eq: contract },
      token_id: { _in: ids }
    }))
  };
};

/** Retry timeouts and transport failures; skip GraphQL-only (query) errors. */
const isRetryableObjktQueryError = (error: unknown) => {
  if (error instanceof Error && 'networkError' in error) {
    return error.networkError != null;
  }

  return true;
};

export const fetchAttributesCounts = (ids: number[], isGallery: boolean) =>
  isGallery
    ? apolloObjktClient
        .fetch<GalleryAttributeCountQueryResponse>(buildGetGalleryAttributeCountQuery(ids))
        .then(data => data?.gallery_attribute_count)
    : apolloObjktClient
        .fetch<FA2AttributeCountQueryResponse>(buildGetFA2AttributeCountQuery(ids))
        .then(data => data?.fa2_attribute_count);

export const fetchCollectibleExtraDetails = (contract: string, id: BigNumber.Value) =>
  apolloObjktClient
    .fetch<{ token: [ObjktCollectibleExtra] | [] }>(buildGetCollectibleExtraQuery(), {
      where: { fa_contract: { _eq: contract }, token_id: { _eq: String(id) } }
    })
    .then(data => data?.token[0] ?? null);
