import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { MarketPlaceEventEnum } from './enums';
import { CollectibleResponse } from './types';

export const transformObjktCollectionItem = (token: CollectibleResponse): CollectionItemInterface => {
  const buyEvents = token.events.filter(
    ({ marketplace_event_type }) =>
      marketplace_event_type === MarketPlaceEventEnum.dutchAuctionBuy ||
      marketplace_event_type === MarketPlaceEventEnum.listBuy ||
      marketplace_event_type === MarketPlaceEventEnum.offerAccept ||
      marketplace_event_type === MarketPlaceEventEnum.offerFloorAccept ||
      marketplace_event_type === MarketPlaceEventEnum.englishAuctionSettle
  );
  const lastDeal = buyEvents.find(event => event.price_xtz !== null);

  return {
    id: token.token_id,
    address: token.fa_contract,
    name: token.name,
    description: token.description,
    artifactUri: token.artifact_uri,
    displayUri: token.display_uri,
    thumbnailUri: token.thumbnail_uri,
    lowestAsk: token.lowest_ask,
    editions: token.supply,
    mime: token.mime,
    holders: token.holders,
    lastDeal: lastDeal && { price: lastDeal.price, currency_id: lastDeal.currency_id },
    items: token.fa.items,
    listingsActive: token.listings_active
  };
};
