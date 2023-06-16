import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo } from '../../interfaces/collectible-info.interface';

export const collectibleInfoInitialState: CollectibleInfo = {
  description: '',
  creators: [],
  fa: {
    name: '',
    logo: '',
    items: 0
  },
  metadata: '',
  artifact_uri: '',
  attributes: [],
  timestamp: '',
  royalties: [],
  supply: 0,
  galleries: [],
  listings_active: [],
  mime: ''
};

export const attributesInfoInitialState: AttributeInfo[] = [
  {
    attribute_id: 0,
    tokens: 0
  }
];
