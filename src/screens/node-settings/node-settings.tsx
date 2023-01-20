import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { generateScreenOptions } from '../../components/header/generate-screen-options.util';
import { HeaderButton } from '../../components/header/header-button/header-button';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { setSelectedRpcUrl } from '../../store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from '../../store/settings/settings-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

export const NodeSettings = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const rpcList = useRpcListSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const radioButtons = useMemo(() => rpcList.map(rpc => ({ label: rpc.name, value: rpc.url })), [rpcList]);

  usePageAnalytic(ScreensEnum.NodeSettings);

  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Default node (RPC)" />,
      <HeaderButton iconName={IconNameEnum.PlusIconOrange} onPress={() => navigate(ModalsEnum.AddCustomRpc)} />
    ),
    []
  );

  const handleChange = (newRpcUrl: string) => dispatch(setSelectedRpcUrl(newRpcUrl));

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup value={selectedRpcUrl} buttons={radioButtons} onChange={handleChange} />
    </ScreenContainer>
  );
};
