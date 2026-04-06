import React from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { isIOS } from 'src/config/system';
import { OverlayEnum } from 'src/navigator/enums/overlay.enum';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking';

import { useForceUpdateStyles } from './force-update.styles';

const APP_STORE_LINK = 'https://apps.apple.com/us/app/temple-wallet-mobile/id1610108763';
const PLAY_MARKET_LINK = 'https://play.google.com/store/apps/details?id=com.templewallet';

const handleUpdate = () => openUrl(isIOS ? APP_STORE_LINK : PLAY_MARKET_LINK);

export const ForceUpdate = () => {
  const styles = useForceUpdateStyles();
  const colors = useColors();
  usePageAnalytic(OverlayEnum.ForceUpdate);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={IconNameEnum.DownloadCloud} size={formatSize(64)} color={colors.orange} />
        </View>
        <Divider />
        <View>
          <Text style={styles.header}>Update Required!</Text>
          <Divider />
          <Text style={styles.description}>An update to Temple Wallet is required to continue.</Text>
        </View>
      </View>
      <View>
        <ButtonLargePrimary title="Update" onPress={handleUpdate} />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
