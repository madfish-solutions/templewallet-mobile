import { groupBy, map, maxBy } from 'lodash-es';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { isDefined } from 'src/utils/is-defined';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { currencyInfoById } from './constants';
import { MarketPlaceEventEnum } from './enums';
import { CollectibleResponse } from './interfaces';

export const transformCollectiblesArray = (array: CollectibleResponse[], selectedPublicKey: string) => {
  const collectiblesArray = array
    .filter(token => token.supply !== 0)
    .map(token => {
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
      const lastPrice = buyEvents.filter(event => event.price_xtz !== null)[0];
      const correctOffers = token.offers_active.filter(offer => offer.buyer_address !== selectedPublicKey);
      const highestOffer = correctOffers[correctOffers.length - 1];
      const currency = currencyInfoById[highestOffer?.currency_id ?? 1];
      const listed = token.listings_active.find(listings => listings.seller_address === selectedPublicKey)?.amount ?? 0;

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
        symbol: currency?.symbol ?? 'TEZ',
        thumbnailUri: token.thumbnail_uri,
        id: Number(token.token_id),
        visibility: VisibilityEnum.Visible,
        editions: token.supply,
        holders: token.holders,
        lastPrice: {
          price: lastPrice?.price,
          symbol: currencyInfoById[lastPrice?.currency_id]?.symbol,
          decimals: currencyInfoById[lastPrice?.currency_id]?.decimals
        },
        listed,
        items: token.fa.items
      };
    });

  return collectiblesArray;
};

export const getUniqueAndMaxValueAttribute = (array: AttributeInfo[]) => {
  const grouped = groupBy(array, 'attribute_id');

  return map(grouped, value => maxBy(value, 'tokens') as AttributeInfo);
};
