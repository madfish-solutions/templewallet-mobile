import React, { FC } from 'react';
import { View } from 'react-native';

import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/toast.utils';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  token: TokenInterface;
}

export const HeaderCardActionButtons: FC<Props> = ({ token }) => {
  const { navigate } = useNavigation();
  const tezosToken = useTezosTokenSelector();
  const styles = useHeaderCardActionButtonsStyles();

  const errorMessage =
    isDefined(token.address) && tezosToken.balance === emptyToken.balance
      ? 'You need to have TEZ to pay gas fee'
      : 'Balance is zero';

  const disableSendAsset = token.balance === emptyToken.balance || tezosToken.balance === emptyToken.balance;

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="RECEIVE"
        iconName={IconNameEnum.ArrowDown}
        onPress={() => navigate(ModalsEnum.Receive, { token })}
      />
      <Divider size={formatSize(8)} />
      <View
        style={styles.buttonContainer}
        onTouchStart={() => void (disableSendAsset && showErrorToast({ description: errorMessage }))}
      >
        <ButtonMedium
          title="SEND"
          disabled={disableSendAsset}
          iconName={IconNameEnum.ArrowUp}
          onPress={() => navigate(ModalsEnum.Send, { token })}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.buttonContainer}>
        <ButtonMedium title="Buy" iconName={IconNameEnum.ShoppingCard} onPress={() => navigate(ScreensEnum.Buy)} />
      </View>
    </ButtonsContainer>
  );
};
