import { pick } from 'lodash-es';

import { ADULT_CONTENT_TAGS } from 'src/apis/objkt/adult-tags';
import { ADULT_ATTRIBUTE_NAME } from 'src/apis/objkt/constants';
import type { ObjktAttribute, ObjktCollectibleDetails, ObjktTag } from 'src/apis/objkt/types';
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
  listingsActive: info.listings_active,
  isAdultContent: checkForAdultery(info.attributes, info.tags)
});

const checkForAdultery = (attributes: ObjktAttribute[], tags: ObjktTag[]) =>
  attributes.some(({ attribute }) => attribute.name === ADULT_ATTRIBUTE_NAME) ||
  tags.some(({ tag }) => {
    return ADULT_CONTENT_TAGS.includes(tag.name);
  });
