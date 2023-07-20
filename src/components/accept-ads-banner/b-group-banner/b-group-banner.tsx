import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';

import { BannerGroupProps } from '../accept-ads-banner.props';
import { AcceptAdsBannerSelectors } from '../accept-ads-banner.selectors';
import { useCommonBannerStyles } from '../common-banner.styles';
import { useBGropuBannerStyles } from './b-group-banner.styles';

export const BGroupBanner: FC<BannerGroupProps> = ({ onDisable, onEnable, style }) => {
  const styles = useBGropuBannerStyles();
  const commonStyles = useCommonBannerStyles();

  return (
    <View style={[commonStyles.root, style]}>
      <Text style={commonStyles.title}>Earn by viewing ads in Temple Wallet</Text>
      <Text style={commonStyles.description}>
        Support the development team and earn tokens by viewing ads inside the wallet. To enable this feature, we
        request your permission to trace your Wallet Address and IP address. You can always disable ads in the settings.
      </Text>

      <View style={styles.buttons}>
        <ButtonLargeSecondary
          title="Disable"
          onPress={onDisable}
          textStyle={commonStyles.buttonText}
          buttonStyle={commonStyles.button}
          style={styles.buttonContainer}
          testID={AcceptAdsBannerSelectors.bGroupDisable}
        />
        <Divider size={formatSize(8)} />
        <ButtonLargePrimary
          title="Enable ADS"
          onPress={onEnable}
          textStyle={commonStyles.buttonText}
          buttonStyle={commonStyles.button}
          style={styles.buttonContainer}
          testID={AcceptAdsBannerSelectors.bGroupEnable}
        />
      </View>
    </View>
  );
};
