import React from 'react';

import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { ModalsEnum } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { IconNameEnum } from '../icon/icon-name.enum';

type Props = {
  slug?: string;
};

export const HeaderCardActionButtons = ({ slug }: Props) => {
  const { navigate } = useNavigation();

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="RECEIVE"
        iconName={IconNameEnum.ArrowDown}
        marginRight={step}
        onPress={() => navigate(ModalsEnum.Receive)}
      />
      <ButtonMedium
        title="SEND"
        iconName={IconNameEnum.ArrowUp}
        marginRight={step}
        onPress={() => navigate(ModalsEnum.Send, slug ? { slug } : undefined)}
      />
      <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
    </ButtonsContainer>
  );
};
