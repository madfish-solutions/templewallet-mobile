import BigNumber from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { objktCurrencies } from 'src/apis/objkt/constants';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import {
  useCollectibleDetailsLoadingSelector,
  useCollectibleDetailsSelector
} from 'src/store/collectibles/collectibles-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { formatNumber } from 'src/utils/format-price';
import { isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { Balance } from './balance';
import { CollectibleItemImage } from './item-image';
import { useCollectibleItemStyles } from './styles';

interface Props {
  slug: string;
  collectible: TokenInterface;
  size: number;
  isShowInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleItem = memo<Props>(({ slug, collectible, size, isShowInfo = false, style }) => {
  const navigateToModal = useNavigateToModal();

  const styles = useCollectibleItemStyles();

  const areDetailsLoading = useCollectibleDetailsLoadingSelector();
  const details = useCollectibleDetailsSelector(slug);

  const balance = collectible.balance;

  const listing = useMemo(() => {
    const cheapestListing = details?.listingsActive[0];
    if (!cheapestListing) {
      return null;
    }

    const { price, currency_id } = cheapestListing;

    const currency = objktCurrencies[currency_id];
    if (!isDefined(currency)) {
      return null;
    }

    const floorPrice = mutezToTz(new BigNumber(price), currency.decimals).toNumber();
    const floorPriceDisplayed = formatNumber(floorPrice);

    return { floorPriceDisplayed, symbol: currency.symbol };
  }, [details]);

  const handleNavigate = useCallback(
    () => navigateToModal(ModalsEnum.CollectibleModal, { slug }),
    [slug, navigateToModal]
  );

  return (
    <SafeTouchableOpacity activeOpacity={0.7} onPress={handleNavigate} style={[styles.root, style, { width: size }]}>
      <View style={[styles.image, { width: size, height: size }]}>
        <CollectibleItemImage
          slug={slug}
          size={size}
          artifactUri={
            details?.artifactUri != null &&
            (isSvgDataUriInBase64Encoding(details.artifactUri) || collectible.artifactUri === 'UNSUPPORTED_EXTENSION')
              ? details.artifactUri
              : collectible.artifactUri
          }
          displayUri={collectible.displayUri ?? details?.displayUri}
          thumbnailUri={collectible.thumbnailUri ?? details?.thumbnailUri}
          areDetailsLoading={areDetailsLoading && details === undefined}
        />

        {isShowInfo && isDefined(balance) ? <Balance balance={balance} /> : null}
      </View>

      {isShowInfo ? (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {collectible.name}
          </Text>

          <Text style={styles.price}>
            {listing ? `Floor: ${listing.floorPriceDisplayed} ${listing.symbol}` : 'Not listed'}
          </Text>
        </View>
      ) : null}
    </SafeTouchableOpacity>
  );
});
