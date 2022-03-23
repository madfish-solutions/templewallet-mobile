import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { OctopusWithLove } from '../../components/octopus-with-love/octopus-with-love';
import { RobotIcon } from '../../components/robot-icon/robot-icon';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerDivider } from '../../components/white-container/white-container-divider/white-container-divider';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
// import { SettingsHeader } from './settings-header/settings-header';
import { useBuyStyles } from './buy.styles';

const TABS = [
  {
    id: 0,
    name: 'Crypto',
    component: <View>1</View>
  },
  {
    id: 1,
    name: 'Debit/Credit Card',
    component: <View>2</View>
  }
];

export const Buy = () => {
  const styles = useBuyStyles();
  const { navigate } = useNavigation();
  const handleLogoutButtonPress = useResetDataHandler();

  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const [tab, setTab] = useState(TABS[1]);

  const handleTabChange = (newTabIndex: number) => setTab(TABS[newTabIndex]);

  return (
    <>
      {/* <SettingsHeader /> */}

      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.upperContainer}>
          <TextSegmentControl selectedIndex={tab.id} values={TABS.map(x => x.name)} onChange={handleTabChange} />
          <Divider size={formatSize(8)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.ManageAccounts)}>
              <View style={styles.actionsContainer}>
                <RobotIcon seed={publicKeyHash} size={formatSize(32)} />
                <WhiteContainerText text="Accounts" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            {/* <WhiteContainerAction disabled={true}>
              <WhiteContainerText text="Appearance" />

              <TextSegmentControl
                selectedIndex={selectedThemeIndex}
                values={['Light', 'Dark']}
                width={formatSize(120)}
                onChange={handleThemeSegmentControlChange}
              />
            </WhiteContainerAction> */}

            <WhiteContainerDivider />

            <WhiteContainerAction onPress={() => navigate(ScreensEnum.SecureSettings)}>
              <View style={styles.actionsContainer}>
                <WhiteContainerText text="Secure" />
              </View>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.DAppsSettings)}>
              <WhiteContainerText text="Authorized DApps" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.NodeSettings)}>
              <WhiteContainerText text="Default node (RPC)" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider size={formatSize(16)} />

          <WhiteContainer>
            <WhiteContainerAction onPress={() => navigate(ScreensEnum.About)}>
              <WhiteContainerText text="About" />
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </WhiteContainerAction>
          </WhiteContainer>
          <Divider />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButtonPress}>
            <Text style={styles.logoutButtonText}>Reset wallet</Text>
            <Icon name={IconNameEnum.LogOut} />
          </TouchableOpacity>
          <Divider />
        </View>
        {!isTablet() && <OctopusWithLove />}
      </ScreenContainer>
    </>
  );
};
