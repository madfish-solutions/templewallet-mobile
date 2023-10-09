import { pick } from 'lodash-es';

import type { ObjktCollectibleDetails } from 'src/apis/objkt/types';
import type { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

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
  listingsActive: info.listings_active
});
