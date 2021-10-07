import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { IconTitleNoBg } from '../../components/icon-title-no-bg/icon-title-no-bg';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { setSelectedRpcUrl } from '../../store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from '../../store/settings/settings-selectors';

export const NodeSettings = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const rpcList = useRpcListSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const radioButtons = useMemo(() => rpcList.map(rpc => ({ label: rpc.name, value: rpc.url })), [rpcList]);

  const handleChange = (newRpcUrl: string) => dispatch(setSelectedRpcUrl(newRpcUrl));

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup value={selectedRpcUrl} buttons={radioButtons} onChange={handleChange} />
      <Divider />

      <IconTitleNoBg
        icon={IconNameEnum.PlusCircle}
        text="ADD CUSTOM RPC"
        onPress={() => navigate(ModalsEnum.AddCustomRpc)}
      />
      <Divider />
    </ScreenContainer>
  );
};
