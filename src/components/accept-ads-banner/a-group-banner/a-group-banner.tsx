import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';

import { BannerGroupProps } from '../accept-ads-banner.props';
import { AcceptAdsBannerSelectors } from '../accept-ads-banner.selectors';
import { useCommonBannerStyles } from '../common-banner.styles';

export const AGroupBanner: FC<BannerGroupProps> = ({ onDisable, onEnable, style }) => {
  const commonStyles = useCommonBannerStyles();

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
        onPress={onEnable}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
        testID={AcceptAdsBannerSelectors.aGroupEnable}
      />
      <Divider size={formatSize(8)} />
      <ButtonLargeSecondary
        title="No thanks"
        onPress={onDisable}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
        testID={AcceptAdsBannerSelectors.aGroupDisable}
      />
    </View>
  );
};
