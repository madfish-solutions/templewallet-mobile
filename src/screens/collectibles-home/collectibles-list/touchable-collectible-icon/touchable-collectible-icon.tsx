import { isNonEmptyArray } from '@apollo/client/utilities';
import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CollectibleIconProps, CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleIcon } from '../../../../components/collectible-icon/collectible-icon';
import { CollectibleInterface } from '../../../../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { formatNumber } from '../../../../utils/format-price';
import { getPurchaseCurrency } from '../../../../utils/get-pusrchase-currency.util';
import { useTouchableCollectibleIconStyles } from './touchable-collectible-icon.styles';

type Props = Omit<CollectibleIconProps, 'collectible'> & {
  collectible: CollectibleInterface;
};

export const TouchableCollectibleIcon: FC<Props> = ({
  collectible,
  size,
  muted,
  iconSize = CollectibleIconSize.BIG,
  audioPlaceholderTheme,
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
        objktArtifact={collectible.artifactUri}
        audioPlaceholderTheme={audioPlaceholderTheme}
        size={size}
        mime={collectible.mime}
        muted={muted}
        isTouchableBlurOverlay={false}
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
