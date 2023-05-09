import { TzProfile } from 'src/interfaces/tzProfile.interface';

import { MarketPlaceEventEnum } from './enums';

export interface CollectibleResponse {
  artifact_uri: string;
  description: string;
  decimals: number;
  display_uri: string;
  fa_contract: string;
  highest_offer: number;
  last_listed: string;
  last_metadata_update: string;
  lowest_ask: number;
  metadata: string;
  name: string;
  thumbnail_uri: string;
  supply: number;
  symbol: string;
  token_id: string;
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
  }[];
}

export interface QueryResponse {
  fa: { name: string; logo: string; creator_address: string; contract: string; tokens: { display_uri: string }[] }[];
}

export interface TzProfilesQueryResponse {
  holder_by_pk: TzProfile;
}

export interface CollectiblesByCollectionResponse {
  token: CollectibleResponse[];
}

export interface CollectibleInfoQueryResponse {
  token: {
    description: string;
    creators: {
      holder: {
        address: string;
        tzdomain: string;
      };
    }[];
    fa: {
      name: string;
      logo: string;
    };
  }[];
}
