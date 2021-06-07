import React, { FC } from 'react';

import { emptyFn } from '../../config/general';
import { ModalsEnum } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { IconNameEnum } from '../icon/icon-name.enum';

type Props = {
  token?: TokenInterface;
};

export const HeaderCardActionButtons: FC<Props> = ({ token }) => {
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
        onPress={() => navigate(ModalsEnum.Send, { token })}
      />
      <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
    </ButtonsContainer>
  );
};
