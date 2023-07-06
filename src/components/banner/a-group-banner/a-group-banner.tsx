import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { ButtonLargePrimary } from '../../button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../divider/divider';
import { BannerGroupProps } from '../banner.props';
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
      <ButtonLargeSecondary
        title="No thanks, I hate free money"
        onPress={onDisable}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
      />
      <Divider size={formatSize(8)} />
      <ButtonLargePrimary
        title="Pay me for every ad I see"
        onPress={onEnable}
        textStyle={commonStyles.buttonText}
        buttonStyle={commonStyles.button}
      />
    </View>
  );
};
