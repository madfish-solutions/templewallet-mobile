import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { OFFSET_BETWEEN_ICONS, SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';
import { CollectibleImage } from 'src/screens/text-to-nft/components/collectible-image/collectible-image';
import { CreateNftSelectors } from 'src/screens/text-to-nft/preview/selectors';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { usePreviewStyles } from './preview.styles';

const ITEMS_PER_ROW = 4;

export const PreviewScreen: FC = () => {
  const { order } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Preview>>().params;
  const styles = usePreviewStyles();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const windowWidth = useWindowDimensions().width;
  const mainCollectibleSize = isTablet()
    ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS)
    : windowWidth - TABBAR_MARGINS;

  const collectibleSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
    OFFSET_BETWEEN_ICONS;

  const handleCreateNft = () => {
    setIsLoading(true);
  };

  return (
    <View style={styles.root}>
      {isDefined(order.variants) && (
        <>
          <CollectibleImage
            uri={order.variants[activeIndex]}
            size={mainCollectibleSize}
            iconSizeType={CollectibleIconSize.BIG}
            style={[styles.borderRadius, styles.marginBottom]}
          />

          <View style={styles.row}>
            {order.variants.map((uri, index) => (
              <TouchableOpacity
                key={uri + index}
                onPress={() => setActiveIndex(index)}
                style={styles.imageContainer}
                testID={CreateNftSelectors.otherVariant}
              >
                <CollectibleImage
                  uri={uri}
                  size={collectibleSize}
                  style={[styles.image, styles.borderRadius, conditionalStyle(index === activeIndex, styles.active)]}
                />

                <Text style={[styles.text, conditionalStyle(index === activeIndex, styles.activeText)]}>{`Variant ${
                  index + 1
                }`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Create NFT"
          onPress={handleCreateNft}
          disabled={isLoading}
          isLoading={isLoading}
          testID={CreateNftSelectors.submitButtonCreateNft}
        />
      </ButtonsFloatingContainer>
    </View>
  );
};
