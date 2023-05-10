import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo } from '../../interfaces/collectible-info.interface';

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfo[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfo[];
}

export interface CollectibleInfoQueryResponse {
  token: CollectibleInfo[];
}
