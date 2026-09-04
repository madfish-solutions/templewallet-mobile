import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Switch } from 'src/components/switch/switch';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerAction } from 'src/components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from 'src/components/white-container/white-container-text/white-container-text';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadConnectionsActions } from 'src/store/d-apps/d-apps-actions';
import { useConnectionsSelector } from 'src/store/d-apps/d-apps-selectors';
import { setIsInAppBrowserEnabledAction } from 'src/store/settings/settings-actions';
import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ConnectionItem } from './connection-item';
import { useDAppsSettingsStyles } from './d-apps-settings.styles';
import { DAppsSettingsSelectors } from './d-apps.settings.selectors';

export const DAppsSettings = () => {
  const dispatch = useDispatch();
  const styles = useDAppsSettingsStyles();

  const connections = useConnectionsSelector();
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();

  usePageAnalytic(ScreensEnum.DAppsSettings);
  useEffect(() => void dispatch(loadConnectionsActions.submit()), []);

  return (
    <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
      <Divider size={formatSize(16)} />
      <Label label="Authorized DApps" description="Click on the trash icon to reset connections." />
      <Divider size={formatSize(12)} />
      <WhiteContainer style={styles.whiteContainer}>
        <WhiteContainerAction
          onPress={() => dispatch(setIsInAppBrowserEnabledAction(!isInAppBrowserEnabled))}
          testID={DAppsSettingsSelectors.inAppBrowserAction}
          testIDProperties={{ newValue: !isInAppBrowserEnabled }}
        >
          <WhiteContainerText text="Open with in-app browser" />
          <Switch
            value={isInAppBrowserEnabled}
            onChange={value => dispatch(setIsInAppBrowserEnabledAction(value))}
            testID={DAppsSettingsSelectors.inAppBrowserToggle}
          />
        </WhiteContainerAction>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
      {connections.data.length === 0 ? (
        <DataPlaceholder text="No connected DApps." />
      ) : (
        connections.data.map(connection => <ConnectionItem key={connection.id} connection={connection} />)
      )}
    </ScreenContainer>
  );
};
