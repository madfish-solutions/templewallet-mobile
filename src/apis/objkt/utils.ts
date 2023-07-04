import { groupBy, map, maxBy } from 'lodash-es';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { isDefined } from 'src/utils/is-defined';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleOfferInteface } from '../../token/interfaces/collectible-interfaces.interface';
import { currencyInfoById } from './constants';
import { MarketPlaceEventEnum } from './enums';
import { CollectibleResponse } from './types';

export const transformCollectiblesArray = (
  array: CollectibleResponse[],
  selectedPublicKey: string
): CollectibleOfferInteface[] => {
  const collectiblesArray = array.map(token => {
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
    const correctOffers = token.offers_active
      .map(item => ({
        ...item,
        buyerAddress: item.buyer_address,
        collectionOffer: item.collection_offer,
        priceXtz: item.price_xtz,
        bigmapKey: item.bigmap_key,
        marketplaceContract: item.marketplace_contract,
        faContract: item.fa_contract,
        currencyId: item.currency_id
      }))
      .filter(offer => offer.buyer_address !== selectedPublicKey);
    const highestOffer = correctOffers[correctOffers.length - 1];
    const currency = currencyInfoById[highestOffer?.currency_id ?? 1];

    const listedBySelectedUser = token.listings_active.reduce((acc, current) => {
      if (current.seller_address === selectedPublicKey) {
        acc += current.amount;
      }

      return acc;
    }, 0);

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
      holders: token.holders.map(item => ({ holderAddress: item.holder_address, quantity: item.quantity })),
      lastPrice: {
        price: lastPrice?.price,
        symbol: currencyInfoById[lastPriceCurrencyId]?.symbol,
        decimals: currencyInfoById[lastPriceCurrencyId]?.decimals
      },
      listed: listedBySelectedUser,
      items: token.fa.items
    };
  });

  return collectiblesArray;
};

export const getUniqueAndMaxValueAttribute = (array: AttributeInfo[]) => {
  const grouped = groupBy(array, 'attribute_id');

  return map(grouped, value => maxBy(value, 'tokens') as AttributeInfo);
};
