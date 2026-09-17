import { pick } from 'lodash-es';

import type { ObjktCollectibleDetails } from 'src/apis/objkt/types';
import { checkForAdultery } from 'src/apis/objkt/utils';
import type { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import type { CollectibleDetailsRecord } from './collectibles-state';

export const convertCollectibleObjktInfoToStateDetailsType = (
  info: ObjktCollectibleDetails
): CollectibleDetailsInterface => ({
  ...pick(
    info,
    'name',
    'description',
    'creators',
    'metadata',
    'attributes',
    'tags',
    'timestamp',
    'royalties',
    'mime',
    'galleries'
  ),
  address: info.fa_contract,
  id: info.token_id,
  artifactUri: info.artifact_uri,
  thumbnailUri: info.thumbnail_uri,
  displayUri: info.display_uri,
  editions: info.supply,
  collection: info.fa,
  listingsActive: info.listings_active,
  isAdultContent: checkForAdultery(info.attributes, info.tags)
});

export const collectiblesDetailsRecordFromObjktBatch = (
  tokens: ObjktCollectibleDetails[],
  missingSlugs: string[]
): CollectibleDetailsRecord => {
  const details: CollectibleDetailsRecord = {};

  for (const info of tokens) {
    details[toTokenSlug(info.fa_contract, info.token_id)] = convertCollectibleObjktInfoToStateDetailsType(info);
  }

  for (const slug of missingSlugs) {
    details[slug] = null;
  }

  return details;
};
