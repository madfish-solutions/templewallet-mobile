import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { supportUkraine } from '../../../../config/socials';
import { formatSize } from '../../../../styles/format-size';
import { openUrl } from '../../../../utils/linking.util';
import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

export const PromotionCarouselItem: FC = () => {
  const styles = usePromotionCarouselItemStyles();

  return (
    <TouchableOpacity style={styles.root} onPress={() => openUrl(supportUkraine)}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.UkraineIcon} width={formatSize(72)} height={formatSize(48)} />
        <Divider size={formatSize(16)} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Stand with Ukraine</Text>
          <Text style={styles.description}>Donate TEZ - support Ukrainians in their fight with Putin occupants.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
