import { CollectibleOfferInteface } from 'src/token/interfaces/collectible-interfaces.interface';
import { isDefined } from 'src/utils/is-defined';

import { objktCurrencies } from './constants';
import { MarketPlaceEventEnum } from './enums';
import { CollectibleResponse } from './types';

export const transformCollectiblesArray = (array: CollectibleResponse[]) =>
  array.map<CollectibleOfferInteface>(token => {
    const buyEvents = isDefined(token)
      ? token.events.filter(
          ({ marketplace_event_type }) =>
            marketplace_event_type === MarketPlaceEventEnum.dutchAuctionBuy ||
            marketplace_event_type === MarketPlaceEventEnum.listBuy ||
            marketplace_event_type === MarketPlaceEventEnum.offerAccept ||
            marketplace_event_type === MarketPlaceEventEnum.offerFloorAccept ||
            marketplace_event_type === MarketPlaceEventEnum.englishAuctionSettle
        )
      : [];
    const lastPrice = buyEvents.find(event => event.price_xtz !== null);
    const lastPriceCurrencyId = lastPrice?.currency_id ?? 1;

    return {
      artifactUri: token.artifact_uri,
      description: token.description,
      displayUri: token.display_uri,
      address: token.fa_contract,
      name: token.name,
      metadata: token.metadata,
      lowestAsk: token.lowest_ask,
      thumbnailUri: token.thumbnail_uri,
      id: Number(token.token_id),
      editions: token.supply,
      mime: token.mime,
      holders: token.holders.map(item => ({ holderAddress: item.holder_address, quantity: item.quantity })),
      lastPrice: {
        price: lastPrice?.price,
        symbol: objktCurrencies[lastPriceCurrencyId]?.symbol,
        decimals: objktCurrencies[lastPriceCurrencyId]?.decimals
      },
      items: token.fa.items,
      listingsActive: token.listings_active
    };
  });
