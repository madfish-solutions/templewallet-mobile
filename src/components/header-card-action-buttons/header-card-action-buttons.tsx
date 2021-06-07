import React, { FC } from 'react';

import { emptyFn } from '../../config/general';
import { ModalsEnum } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { AssetMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { IconNameEnum } from '../icon/icon-name.enum';

interface Props {
  asset: AssetMetadataInterface;
}

export const HeaderCardActionButtons: FC<Props> = ({ asset }) => {
  const { navigate } = useNavigation();

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="RECEIVE"
        iconName={IconNameEnum.ArrowDown}
        marginRight={formatSize(8)}
        onPress={() => navigate(ModalsEnum.Receive)}
      />
      <ButtonMedium
        title="SEND"
        iconName={IconNameEnum.ArrowUp}
        marginRight={formatSize(8)}
        onPress={() => navigate(ModalsEnum.Send, { asset })}
      />
      <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
    </ButtonsContainer>
  );
};
