import React, { FC } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { setAdsBannerVisibilityAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';

import { ButtonLargePrimary } from '../button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../divider/divider';

import { AcceptAdsBannerSelectors } from './accept-ads-banner.selectors';
import { useCommonBannerStyles } from './common-banner.styles';

interface BannerProps {
  style?: StyleProp<ViewStyle>;
}

export const AcceptAdsBanner: FC<BannerProps> = ({ style }) => {
  const dispatch = useDispatch();
  const commonStyles = useCommonBannerStyles();

  const handleDisableBannerButton = () => {
    dispatch(togglePartnersPromotionAction(false));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  const handleEnableBannerButton = () => {
    dispatch(togglePartnersPromotionAction(true));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  return (
    <View style={[commonStyles.root, style]}>
      <Text style={commonStyles.title}>Get paid to discover exciting services and dApps! 👀💰</Text>
      <Text style={commonStyles.description}>
        Here's the deal: share some data with us (wallet address, IP) to see the most relevant ads and we'll *pay you* a
        fair share monthly. By doing so, you support the developers of Temple Wallet. Change your mind? Easily disable
        sharing in settings.
      </Text>
      <Text style={commonStyles.description}>Start earning now!</Text>
      <ButtonLargePrimary
        title="Pay me for every ad I see"
        onPress={handleEnableBannerButton}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
        testID={AcceptAdsBannerSelectors.aGroupEnable}
      />
      <Divider size={formatSize(8)} />
      <ButtonLargeSecondary
        title="No thanks"
        onPress={handleDisableBannerButton}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
        testID={AcceptAdsBannerSelectors.aGroupDisable}
      />
    </View>
  );
};
