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
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDcpNode } from 'src/utils/network.utils';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { NodeSettingsSelectors } from './node-settings.selectors';

export const NodeSettings = () => {
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();

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
            disabled: rpc.url === TEMPLE_RPC.url || isDcpNode(rpc.url) ? true : undefined,
            onPress: () => void navigateToModal(ModalsEnum.EditCustomRpc, { url: rpc.url })
          }
        ],
        disabledMessage: isDcpNode(rpc.url) ? 'The T4L3NT Mainnet RPC is temporarily unavailable.' : undefined
      })),
    [rpcList]
  );

  usePageAnalytic(ScreensEnum.NodeSettings);

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Default node (RPC)" />,
      <HeaderButton
        iconName={IconNameEnum.PlusIconOrange}
        onPress={() => navigateToModal(ModalsEnum.AddCustomRpc)}
        testID={NodeSettingsSelectors.addNodeButton}
      />
    ),
    []
  );

  const handleChange = (newRpcUrl: string) => dispatch(setSelectedRpcUrl(newRpcUrl));

  return (
    <ScreenContainer>
      <StyledRadioGroup
        value={selectedRpcUrl}
        items={radioItems}
        onChange={handleChange}
        testID={NodeSettingsSelectors.nodeRadioButton}
      />
    </ScreenContainer>
  );
};
