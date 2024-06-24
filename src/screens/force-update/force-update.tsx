import React from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { isIOS } from '../../config/system';
import { OverlayEnum } from '../../navigator/enums/overlay.enum';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../utils/linking';

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
