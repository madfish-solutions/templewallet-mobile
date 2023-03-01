import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledRadioGroup } from 'src/components/styled-radio-group';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { NodeSettingsSelectors } from './node-settings.selectors';

export const NodeSettings = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const rpcList = useRpcListSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const radioItems = useMemo(
    () =>
      rpcList.map(rpc => ({
        label: rpc.name,
        value: rpc.url,
        buttons: [
          {
            key: 'edit',
            iconName: IconNameEnum.Edit,
            disabled: rpc.url === TEMPLE_RPC.url ? true : undefined,
            onPress: () => void navigate(ModalsEnum.EditCustomRpc, { url: rpc.url })
          }
        ]
      })),
    [rpcList]
  );

  usePageAnalytic(ScreensEnum.NodeSettings);

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Default node (RPC)" />,
      <HeaderButton
        iconName={IconNameEnum.PlusIconOrange}
        onPress={() => navigate(ModalsEnum.AddCustomRpc)}
        testID={NodeSettingsSelectors.addNodeButton}
      />
    ),
    []
  );

  const handleChange = (newRpcUrl: string) => dispatch(setSelectedRpcUrl(newRpcUrl));

  return (
    <ScreenContainer>
      <StyledRadioGroup value={selectedRpcUrl} items={radioItems} onChange={handleChange} />
    </ScreenContainer>
  );
};
