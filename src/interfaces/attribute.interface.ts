export interface AttributeInfo {
  attribute_id: number;
  tokens: number;
}

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfo[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfo[];
}
