import { VisibilityEnum } from 'src/enums/visibility.enum';
import { isDefined } from 'src/utils/is-defined';

import { currencyInfoById } from './constants';
import { MarketPlaceEventEnum } from './enums';
import { CollectibleResponse } from './types';

export const transformCollectiblesArray = (array: CollectibleResponse[], selectedPublicKey: string) => {
  const collectiblesArray = array
    .map(token => {
      const buyEvents = isDefined(token)
        ? token.events.filter(
            ({ marketplace_event_type }) =>
              marketplace_event_type === MarketPlaceEventEnum.dutchAuctionBuy ||
              marketplace_event_type === MarketPlaceEventEnum.listBuy ||
              marketplace_event_type === MarketPlaceEventEnum.offerAccept ||
              marketplace_event_type === MarketPlaceEventEnum.offerFloorAccept
          )
        : [];
      const lastPrice = buyEvents.filter(event => event.price_xtz !== null)[0];
      const correctOffers = token.offers_active.filter(offer => offer.buyer_address !== selectedPublicKey);
      const highestOffer = correctOffers[correctOffers.length - 1];
      const currency = currencyInfoById[highestOffer?.currency_id ?? 1];

      return {
        artifactUri: token.artifact_uri,
        balance: '1',
        decimals: currency?.decimals ?? 6,
        description: token.description,
        displayUri: token.display_uri,
        address: token.fa_contract,
        highestOffer: highestOffer,
        name: token.name,
        metadata: token.metadata,
        lowestAsk: token.lowest_ask,
        symbol: currency.symbol,
        thumbnailUri: token.thumbnail_uri,
        id: Number(token.token_id),
        visibility: VisibilityEnum.Visible,
        editions: token.supply,
        holders: token.holders,
        lastPrice: {
          price: lastPrice?.price,
          symbol: currencyInfoById[lastPrice?.currency_id]?.symbol,
          decimals: currencyInfoById[lastPrice?.currency_id]?.decimals
        }
      };
    })
    .filter(collectible => collectible.editions !== 0);

  return collectiblesArray;
};
