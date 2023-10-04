import { isNonEmptyArray } from '@apollo/client/utilities';
import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  CollectibleIcon,
  CollectibleIconProps,
  CollectibleIconSize
} from 'src/components/collectible-icon/collectible-icon';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { CollectibleInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { formatNumber } from 'src/utils/format-price';
import { getPurchaseCurrency } from 'src/utils/get-pusrchase-currency.util';
import { isDefined } from 'src/utils/is-defined';

import { useTouchableCollectibleIconStyles } from './touchable-collectible-icon.styles';

type Props = Omit<CollectibleIconProps, 'collectible'> & {
  collectible: CollectibleInterface;
};

export const TouchableCollectibleIcon: FC<Props> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL,
  isShowInfo = false,
  style
}) => {
  const { navigate } = useNavigation();

  const handleNavigate = () =>
    navigate(ModalsEnum.CollectibleModal, {
      slug: getTokenSlug(collectible)
    });

  const styles = useTouchableCollectibleIconStyles();

  const purchaseCurrency = useMemo(() => getPurchaseCurrency(collectible.listingsActive), [collectible.listingsActive]);

  const priceTitle = useMemo(() => {
    if (isNonEmptyArray(collectible.listingsActive)) {
      return `Floor: ${formatNumber(purchaseCurrency.priceToDisplay)} ${purchaseCurrency.symbol}`;
    }

    return 'Not listed';
  }, [purchaseCurrency, collectible]);

  return isDefined(collectible) ? (
    <TouchableOpacity activeOpacity={1} onPress={handleNavigate} style={[styles.root, style, { width: size }]}>
      <CollectibleIcon
        iconSize={iconSize}
        collectible={collectible}
        mime={collectible.mime}
        size={size}
        isShowInfo={isShowInfo}
      />

      {isShowInfo && (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {collectible.name}
          </Text>

          <Text style={styles.price}>{priceTitle}</Text>
        </View>
      )}
    </TouchableOpacity>
  ) : null;
};
